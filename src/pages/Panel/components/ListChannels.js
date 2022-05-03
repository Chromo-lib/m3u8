import React, { useEffect, useState } from 'react'
import useChannels from '../store/useChannels';
import useCurrentChannel from '../store/useCurrentChannel';
import PlayIcon from '../icons/PlayIcon';
import TvIcon from '../icons/TvIcon';
import HeartIcon from '../icons/HeartIcon';

export default function ListChannels() {
  const [defaultChannels, setDefaultChannels] = useState([]);

  const [_, channelsActions] = useChannels();
  const [currentChannel, currentChannelActions] = useCurrentChannel();

  useEffect(() => {
    fetch('https://api.npoint.io/c6ee3f6b723c086b35af')
      .then(r => r.json())
      .then(chs => {
        setDefaultChannels(chs);
      })
      .catch(e => { });
  }, []);

  return <ul className='h-100 overflow list-tv'>
    {defaultChannels.length && defaultChannels.map((c, i) => <li key={i}
      className="d-flex align-center justify-between cp"
    >
      <div className={'d-flex align-center truncate' + (currentChannel.url === c.url ? ' active' : '')}
        onClick={() => { currentChannelActions.set({ ...c, qualityIndex: -1 }); }}>
        {currentChannel.url === c.url
          ? <PlayIcon />
          : <TvIcon />}
        <span className='ml-2 truncate' title={c.name}>{c.name}</span>
      </div>

      <div onClick={() => { channelsActions.addToFavorites(c) }} title="Add to favorites">
        <span><HeartIcon color={defaultChannels.some(f => f.url == c.url) ? "#e91e63" : "#fff"} /></span>
      </div>
    </li>)}
  </ul>
}
