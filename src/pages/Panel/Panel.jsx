import React, { useEffect, useState } from 'react';
import * as Hls from 'hls.js';
import TvIcon from './icons/TvIcon';
import HeartIcon from './icons/HeartIcon';
import PlayIcon from './icons/PlayIcon';
import QualityInfo from './QualityInfo';
import TrashIcon from './icons/TrashIcon';
import PlusIcon from './icons/PlusIcon';
import TimesIcon from './icons/TimesIcon';

let hls = null;
const localChannels = localStorage.getItem('channels');
const localFavorites = localStorage.getItem('favorites');

const Panel = () => {
  const [qualityLevels, setQualityLevels] = useState(null);
  const [qualityIndex, setqualityIndex] = useState(localStorage.getItem('quality') || -1)

  const [currentChannel, setCurrentChannel] = useState({
    type: "m3u8",
    url: 'https://admdn2.cdn.mangomolo.com/nagtv/smil:nagtv.stream.smil/chunklist.m3u8'
  });

  const [newChannel, setNewChannel] = useState({ name: '', url: '', type: 'm3u8' });
  const [channels, setChannels] = useState(localChannels ? JSON.parse(localChannels) : []);
  const [favorites, setFavorites] = useState(localFavorites ? JSON.parse(localFavorites) : []);

  const [tab, setTab] = useState(channels || []);
  const [tabName, setTabName] = useState('channels')

  const [showBox, setShowBox] = useState(false);

  const destroyHLS = () => {
    hls.stopLoad();
    hls.detachMedia();
    hls.destroy();
  };

  const onQualityChange = e => {
    setqualityIndex(e.target.value);
    localStorage.setItem('quality', e.target.value);
  }

  useEffect(() => {
    fetch('https://api.npoint.io/c6ee3f6b723c086b35af')
      .then(r => r.json())
      .then(channels => {
        setChannels(channels);
        setTab(channels);
      })
      .catch(e => { });

    return () => {

    }
  }, []);

  const onManifestParsed = (eventName, data) => {
    console.log(data.levels);
    setQualityLevels(data.levels)
  }

  const onHlsError = (event, data) => {
    console.log('HLS.Events.ERROR: ', event, data);
    if (data.fatal) {
      switch (data.type) {
        case Hls.ErrorTypes.NETWORK_ERROR:
          hls.startLoad();
          break;
        case Hls.ErrorTypes.MEDIA_ERROR:
          hls.recoverMediaError();
          break;
        default:
          hls.destroy();
          break;
      }
    }
  }

  useEffect(() => {
    if (!document.querySelector('video')) return;
    const video = document.querySelector('video');

    if (hls) destroyHLS();

    if (Hls.isSupported() && currentChannel.type === 'm3u8') {
      hls = new Hls();
      hls.loadSource(currentChannel.url);
      hls.attachMedia(video);
      hls.currentLevel = parseInt(qualityIndex, 10);

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
      hls.off(Hls.Events.MANIFEST_PARSED, onManifestParsed);
      hls.off(Hls.Events.ERROR, onHlsError);
    }
  }, [currentChannel.url, qualityIndex]);

  const onChannel = channel => {
    setCurrentChannel(channel);
    setqualityIndex(-1);
  }

  const onPlayChannelChange = e => {
    setNewChannel({ ...newChannel, [e.target.name]: e.target.value });
  }

  const onPlayChannel = e => {
    e.preventDefault();
    setCurrentChannel(newChannel);
  }

  const onAddChannel = () => {
    const temp = channels.slice(0);
    if (newChannel.url.length > 2 && !temp.some(c => c.url === newChannel.url)) {
      temp.unshift(newChannel);
      setChannels(temp);
      localStorage.setItem('channels', JSON.stringify(temp));

      onAddToFavorites(newChannel);
    }
  }

  const onTab = tabName => {
    if (tabName === 'channels' && channels) setTab(channels);
    if (tabName === 'favorites' && favorites) setTab(favorites);
    setTabName(tabName);
  }

  const onAddToFavorites = ch => {
    const temp = [...favorites];

    if (!favorites.some(c => c.url === ch.url)) {
      temp.unshift(ch);
      setFavorites(temp);
      setTabName('favorites');
      setTab(temp);
      localStorage.setItem('favorites', JSON.stringify(temp));
    }
  }

  const onRemoveFromFavorites = ch => {
    const temp = [...favorites].filter(c => c.url !== ch.url);
    setFavorites(temp);
    setTab(temp);
    localStorage.setItem('favorites', JSON.stringify(temp));
  }

  return (<main>
    <section>
      <div className='video-container'>
        <video className='w-100 br7' src="" controls autoPlay></video>

        <div>
          {qualityLevels && <select className='mr-2' name="quality" onChange={onQualityChange}>
            <option value="-1">auto</option>
            {qualityLevels.map((q, i) => <option key={i} value={i}>{q.name}</option>)}
          </select>}

          <button
            title="Play Or Add New Channel"
            onClick={() => { setShowBox(!showBox); }}><PlusIcon /></button>
        </div>

        {qualityLevels && <QualityInfo qualityLevels={qualityLevels} qualityIndex={qualityIndex} />}
      </div>

      {showBox && <div className='w-100 d-flex box blur'>
        <form className='w-100 d-flex mr-2' onSubmit={onPlayChannel}>
          <input className='w-100' type="url" name='url'
            value={newChannel.url}
            onChange={onPlayChannelChange}
            placeholder='https://f24hls-i.akamaihd.net/hls/live/221148/F24_AR_HI_HLS/master_900.m3u8'
            required
          />

          <input type="text" name="name"
            value={newChannel.name}
            onChange={onPlayChannelChange}
            placeholder='Enter channel name: CNN' required />

          <select name='type' value={newChannel.type} onChange={onPlayChannelChange}>
            <option value="m3u8">m3u8</option>
            <option value="mp4">mp4</option>
            <option value="webm">webm</option>
          </select>

          <button type='submit' title='Play'><PlayIcon /></button>
        </form>

        <button className='mr-2' onClick={onAddChannel} title="Add To Favorites"><PlusIcon /></button>
        <button className='bg-inherit' onClick={() => { setShowBox(!showBox); }} title="Close Box"><TimesIcon /></button>
      </div>}
    </section>

    <aside className='br7'>
      <ul className='w-100 d-flex justify-between'>
        <li className='w-100 bg-bleu uppercase center' title="Channels" onClick={() => { onTab('channels') }}><TvIcon /></li>
        <li className='w-100 bg-bleu uppercase center' title="Favorites" onClick={() => { onTab('favorites') }}><HeartIcon /></li>
      </ul>

      <ul className='h-100 overflow list-tv'>
        {tab && tab.length > 0 && tab.map((c, i) => <li key={i}
          className="d-flex align-center justify-between cp"
        >
          <div className={'d-flex align-center truncate' + (currentChannel.url === c.url ? ' active' : '')}
            onClick={() => { onChannel(c); }}>
            {currentChannel.url === c.url
              ? <PlayIcon />
              : <TvIcon />}
            <span className='ml-2 truncate' title={c.name}>{c.name}</span>
          </div>
          {tabName === 'channels'
            ? <div onClick={() => { onAddToFavorites(c) }} title="Add to favorites"><span><HeartIcon color={favorites.some(f => f.url == c.url) ? "#e91e63" : "#fff"} /></span></div>
            : <div onClick={() => { onRemoveFromFavorites(c) }} title="Remove from favorites"><span><TrashIcon /></span></div>}
        </li>)}
      </ul>
    </aside>
  </main>);
};

export default Panel;
