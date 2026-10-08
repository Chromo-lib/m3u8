import React, { useCallback, useRef, useState } from 'react';
import ListFavorites from './components/ListFavorites';
import VideoContainer from './components/VideoContainer';
import TvIcon from './icons/TvIcon';
import HeartIcon from './icons/HeartIcon';
import ListChannels from './components/ListChannels';
import Modal from './components/Modal';
import useChannels from './store/useChannels';
import useCurrentChannel from './store/useCurrentChannel';
import Header from './components/Header';

export default function App() {
  const [channelsState] = useChannels();
  const [currentChannel] = useCurrentChannel();
  const videoRef = useRef(null);
  const recorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingError, setRecordingError] = useState('');
  const [channel, setChannel] = useState('');
  const tempChannels = channelsState.defaultChannels.filter((item) =>
    item.name.toLowerCase().includes(channel)
  );

  const tabs = [
    { name: 'Channels', icon: <TvIcon /> },
    { name: 'Favorites', icon: <HeartIcon /> }
  ];

  const [tabIndex, setTabIndex] = useState(0);

  const onChangeTab = useCallback((index) => {
    setTabIndex(index)
  }, []);

  const onSearch = (e) => {
    setChannel(e.target.value.toLowerCase());
  };

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
    <main className="flex min-h-screen w-full flex-col gap-4 bg-[#0b0b0d] p-3 text-white sm:p-4 lg:h-screen lg:flex-row lg:overflow-y-auto lg:p-5">
      <section className="flex min-h-[65vh] min-w-0 flex-1 flex-col lg:min-h-0">
        <div className="flex min-h-0 w-full flex-1 flex-col gap-3">
          <Header
            channelName={currentChannel.name}
            isRecording={isRecording}
            recordingError={recordingError}
            onToggleRecording={onToggleRecording}
          />
          <VideoContainer videoRef={videoRef} />
        </div>
      </section>

      <aside className="max-h-[360px] w-full shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/95 shadow-2xl shadow-black/30 lg:h-full lg:max-h-none lg:w-[290px]">
        <div className="grid grid-cols-2 border-b border-white/10 bg-zinc-800/60">
          {tabs.map((tab, i) => (
            <button
              key={i}
              type="button"
              className={[
                'flex items-center justify-center gap-2 px-3 py-3 text-xs font-semibold uppercase tracking-[0.18em] transition-colors',
                tabIndex === i ? 'bg-[#eed75f] text-[#111]' : 'bg-transparent text-white/70 hover:bg-white/5'
              ].join(' ')}
              title={tab.name}
              onClick={() => onChangeTab(i)}
            >
              {tab.icon}
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {tabIndex === 0 && (
          <ListChannels channels={tempChannels}>
            <li className="border-b border-white/10 p-0">
              <input
                className="w-full border-0 bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none"
                type="text"
                name="channel"
                placeholder="Search channel..."
                value={channel}
                onChange={onSearch}
              />
            </li>
          </ListChannels>
        )}

        {tabIndex === 1 && <ListFavorites />}
      </aside>

      <Modal />
    </main>
  );
}
