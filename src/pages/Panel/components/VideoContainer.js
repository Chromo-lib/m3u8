import React, { useEffect, useRef } from 'react';
import * as Hls from 'hls.js';
import useCurrentChannel from '../store/useCurrentChannel';
import Header from './Header';
import QualityInfo from './ChannelQualityInfo';
import PlayIcon from '../icons/PlayIcon';
import useModal from '../store/useModal';

let hls = null;

export default function VideoContainer() {
  const videoRef = useRef();
  const [currentChannel, currentChannelActions] = useCurrentChannel();
  const [_, modalActions] = useModal();

  const onManifestParsed = (_, data) => {
    currentChannelActions.setQualityLevels(data.levels)
  }

  // const onFRAG_BUFFERED = (eventName, data) =>{ 
  //   const bitrate =Math.round(8 * data.stats.total / (data.stats.buffering.end - data.stats.loading.first))
  //   console.log(bitrate,data);
  // }

  const onHlsError = (event, data) => {
    console.log('HLS.Events.ERROR: ', event, data);
    if (data.fatal) {
      switch (data.type) {
        case Hls.ErrorTypes.NETWORK_ERROR:
          modalActions.setContent({ title: 'NETWORK_ERROR', content: <p>{currentChannel.url}</p> });
          hls.startLoad();
          break;
        case Hls.ErrorTypes.MEDIA_ERROR:
          modalActions.setContent({ title: 'MEDIA_ERROR', content: <p>{currentChannel.url}</p> });
          hls.recoverMediaError();
          break;
        default:
          hls.destroy();
          break;
      }
    }

    localStorage.clear('current-channel');
  }

  useEffect(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    if (hls) hls.destroy();

    if (Hls.isSupported() && currentChannel.type === 'm3u8') {
      hls = new Hls();
      hls.loadSource(currentChannel.url);
      hls.attachMedia(video);
      hls.currentLevel = parseInt(currentChannel.qualityIndex, 10);

      // hls.on(Hls.Events.FRAG_BUFFERED, onFRAG_BUFFERED)
      hls.on(Hls.Events.MANIFEST_PARSED, onManifestParsed);
      hls.on(Hls.Events.ERROR, onHlsError);
    }
    else {
      video.src = currentChannel.url;
      video.addEventListener('canplay', async () => {
        await video.play();
      });
    }

    return () => {
      // hls.off(Hls.Events.FRAG_BUFFERED, onFRAG_BUFFERED);
      hls.off(Hls.Events.MANIFEST_PARSED, onManifestParsed);
      hls.off(Hls.Events.ERROR, onHlsError);
    }
  }, [currentChannel.url, currentChannel.qualityIndex]);

  return <section>
    <div className='video-container'>
      <Header />
      <video className='br7 mb-1' ref={videoRef} src="" controls autoPlay></video>

      <div className='w-100'>
        <div className='text-left d-flex align-center mb-1 yellow'>
          <PlayIcon width='12' height='12' />
          <span className='ml-1 uppercase mr-2'>{currentChannel.name}</span>
          <p className='m-0 text-left truncate white'>({currentChannel.url})</p>
        </div>
        <QualityInfo />
      </div>
    </div>
  </section>
}
