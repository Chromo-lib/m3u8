import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import useCurrentChannel from '../store/useCurrentChannel';
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

export default function VideoContainer({ videoRef }) {
  const hlsRef = useRef(null);
  const [currentChannel, currentChannelActions] = useCurrentChannel();
  const [metrics, setMetrics] = useState(initialMetrics);

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

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 rounded-[22px] border border-white/10 bg-zinc-900/80 p-3 shadow-2xl shadow-black/20 sm:p-4">
      <video
        className="aspect-video max-h-[70vh] min-h-[220px] w-full rounded-2xl bg-black object-contain lg:max-h-none"
        ref={videoRef}
        controls
        autoPlay
        playsInline
      />

      <StreamDiagnostics metrics={metrics} />
    </div>
  );
}
