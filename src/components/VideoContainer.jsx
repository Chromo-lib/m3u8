import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import useCurrentChannel from '../store/useCurrentChannel';
import PlayIcon from '../icons/PlayIcon';
import StreamDiagnostics from './StreamDiagnostics';

const initialMetrics = {
  status: 'Connecting',
  engine: 'Detecting',
  isLive: null,
  variants: 0,
  currentTime: 0,
  duration: NaN,
  width: 0,
  height: 0,
  videoCodec: '',
  audioCodec: '',
  frameRate: 0,
  bitrate: 0,
  bandwidth: 0,
  buffer: 0,
  latency: 0,
  liveSyncDistance: null,
  targetLatency: null,
  targetDuration: 0,
  droppedFrames: null,
  totalFrames: null,
  error: ''
};

function readMetrics(video, hls) {
  const currentLevel = hls?.currentLevel >= 0
    ? hls.currentLevel
    : hls?.loadLevel ?? -1;
  const level = currentLevel >= 0 ? hls?.levels[currentLevel] : null;
  const playbackQuality = video.getVideoPlaybackQuality?.();
  const liveSyncPosition = hls?.liveSyncPosition;

  return {
    currentTime: video.currentTime || 0,
    duration: video.duration,
    width: video.videoWidth || level?.width || 0,
    height: video.videoHeight || level?.height || 0,
    videoCodec: level?.videoCodec || '',
    audioCodec: level?.audioCodec || '',
    frameRate: level?.frameRate || 0,
    bitrate: level?.bitrate || 0,
    bandwidth: hls?.bandwidthEstimate || 0,
    buffer: hls?.mainForwardBufferInfo?.len || 0,
    latency: hls?.latency || 0,
    liveSyncDistance: liveSyncPosition == null
      ? null
      : Math.max(0, liveSyncPosition - video.currentTime),
    targetLatency: hls?.targetLatency ?? null,
    droppedFrames: playbackQuality?.droppedVideoFrames ?? null,
    totalFrames: playbackQuality?.totalVideoFrames ?? null
  };
}

export default function VideoContainer() {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const recorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const [currentChannel, currentChannelActions] = useCurrentChannel();
  const [metrics, setMetrics] = useState(initialMetrics);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingError, setRecordingError] = useState('');

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    let hls = null;
    let metricsTimer;
    let destroyed = false;
    setMetrics(initialMetrics);

    const setPlaybackStatus = (status) => {
      if (!destroyed) setMetrics((previous) => ({ ...previous, status }));
    };
    const onPlaying = () => setPlaybackStatus('Playing');
    const onWaiting = () => setPlaybackStatus('Buffering');
    const onPause = () => {
      if (!video.ended) setPlaybackStatus('Paused');
    };
    const onEnded = () => setPlaybackStatus('Ended');
    const onMediaError = () => setPlaybackStatus('Playback error');

    video.addEventListener('playing', onPlaying);
    video.addEventListener('waiting', onWaiting);
    video.addEventListener('pause', onPause);
    video.addEventListener('ended', onEnded);
    video.addEventListener('error', onMediaError);

    const updateMetrics = () => {
      setMetrics((previous) => ({
        ...previous,
        ...readMetrics(video, hls)
      }));
    };

    if (Hls.isSupported()) {
      hls = new Hls();
      hlsRef.current = hls;
      setMetrics((previous) => ({
        ...previous,
        engine: `hls.js ${Hls.version}`,
        status: 'Loading manifest'
      }));

      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        currentChannelActions.setQualityLevels(data.levels);
        hls.currentLevel = currentChannel.qualityIndex;
        setMetrics((previous) => ({
          ...previous,
          engine: `hls.js ${Hls.version}`,
          variants: data.levels.length,
          status: 'Buffering',
          error: ''
        }));
      });

      hls.on(Hls.Events.LEVEL_LOADED, (_, data) => {
        setMetrics((previous) => ({
          ...previous,
          isLive: data.details.live,
          targetDuration: data.details.targetduration
        }));
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (!data.fatal) return;

        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          setMetrics((previous) => ({
            ...previous,
            status: 'Reconnecting',
            error: data.details
          }));
          hls.startLoad();
        } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          setMetrics((previous) => ({
            ...previous,
            status: 'Recovering media',
            error: data.details
          }));
          hls.recoverMediaError();
        } else {
          setMetrics((previous) => ({
            ...previous,
            status: 'Playback error',
            error: data.details
          }));
          hls.destroy();
          hlsRef.current = null;
        }
      });

      hls.attachMedia(video);
      hls.loadSource(currentChannel.url);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      setMetrics((previous) => ({
        ...previous,
        engine: 'Native HLS',
        status: 'Buffering'
      }));
      video.src = currentChannel.url;
    } else {
      setMetrics((previous) => ({
        ...previous,
        engine: 'Unavailable',
        status: 'Unsupported browser',
        error: 'This browser cannot play HLS streams.'
      }));
    }

    metricsTimer = window.setInterval(updateMetrics, 1000);

    return () => {
      destroyed = true;
      window.clearInterval(metricsTimer);
      video.removeEventListener('playing', onPlaying);
      video.removeEventListener('waiting', onWaiting);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('ended', onEnded);
      video.removeEventListener('error', onMediaError);

      if (recorderRef.current?.state === 'recording') {
        recorderRef.current.stop();
      }
      if (hls) {
        hls.destroy();
        if (hlsRef.current === hls) hlsRef.current = null;
      }
      video.pause();
      video.removeAttribute('src');
      video.load();
    };
  }, [currentChannel.url, currentChannel.type]);

  useEffect(() => {
    const hls = hlsRef.current;
    if (hls && hls.levels.length) {
      hls.currentLevel = currentChannel.qualityIndex;
    }
  }, [currentChannel.qualityIndex]);

  const onToggleRecording = () => {
    const recorder = recorderRef.current;
    if (recorder?.state === 'recording') {
      recorder.stop();
      return;
    }

    const video = videoRef.current;
    const captureStream = video?.captureStream || video?.mozCaptureStream;
    if (!video || !captureStream || typeof MediaRecorder === 'undefined') {
      setRecordingError('Stream recording is not supported by this browser.');
      return;
    }
    if (video.paused) {
      setRecordingError('Start playback before recording the stream.');
      return;
    }

    const mimeType = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm',
      'video/mp4'
    ].find((type) => MediaRecorder.isTypeSupported(type));

    if (!mimeType) {
      setRecordingError('This browser does not support a downloadable recording format.');
      return;
    }

    try {
      const mediaRecorder = new MediaRecorder(captureStream.call(video), { mimeType });
      recordedChunksRef.current = [];
      setRecordingError('');
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) recordedChunksRef.current.push(event.data);
      };
      mediaRecorder.onstart = () => setIsRecording(true);
      mediaRecorder.onerror = () => {
        setRecordingError('Recording failed. Check stream playback and browser permissions.');
        setIsRecording(false);
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: mediaRecorder.mimeType });
        recordedChunksRef.current = [];
        recorderRef.current = null;
        setIsRecording(false);

        if (blob.size === 0) {
          setRecordingError('No playable data was captured. Try recording while the stream is playing.');
          return;
        }

        const objectUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const extension = mediaRecorder.mimeType.includes('mp4') ? 'mp4' : 'webm';
        const fileName = (currentChannel.name || 'stream')
          .trim()
          .replace(/[^a-z0-9]+/gi, '-')
          .replace(/^-|-$/g, '')
          .toLowerCase();
        link.href = objectUrl;
        link.download = `${fileName || 'stream'}-${new Date().toISOString().replace(/[:.]/g, '-')}.${extension}`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
      };

      recorderRef.current = mediaRecorder;
      mediaRecorder.start(1000);
    } catch {
      setRecordingError('The browser could not start recording this stream.');
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 rounded-[22px] border border-white/10 bg-zinc-900/80 p-3 shadow-2xl shadow-black/20 sm:p-4">
      <video
        className="aspect-video max-h-[70vh] min-h-[220px] w-full rounded-2xl bg-black object-contain lg:max-h-none"
        ref={videoRef}
        controls
        autoPlay
        playsInline
      />

      <StreamDiagnostics
        metrics={metrics}
        channel={currentChannel}
        isRecording={isRecording}
        onToggleRecording={onToggleRecording}
      />
      {recordingError && (
        <p role="alert" className="rounded-xl border border-red-400/20 bg-red-400/5 px-3 py-2 text-xs text-red-200">
          {recordingError}
        </p>
      )}
    </div>
  );
}
