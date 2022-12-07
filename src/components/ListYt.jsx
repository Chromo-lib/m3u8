import React, { useEffect, useState } from 'react';
import useCurrentChannel from '../store/useCurrentChannel';
import PlayIcon from '../icons/PlayIcon';
import TvIcon from '../icons/TvIcon';

function ListYt({ channels }) {
  const [currentChannel, currentChannelActions] = useCurrentChannel();
  const [chs, setChs] = useState([]);
  const [channel, setChannel] = useState('');

  useEffect(() => {
    setChs(channels);
  }, [channels])

  const onSearch = (e) => {
    try {
      const ch = e.target.value.toLowerCase();
      const filtered = channels.filter(c => c.name.toLowerCase().includes(ch));
      setChs(filtered);
      setChannel(ch)
    } catch (error) {
      setChs(channels);
      setChannel('')
    }
  }

  return <ul className='h-100 overflow list-tv'>

    <li className='p-0'>
      <input className='w-100 bg-inherit' type="text"
        name='channel'
        placeholder='BBC'
        value={channel}
        onChange={onSearch}
      />
    </li>

    {chs.length > 0 && chs.map((c, i) => <li key={i}
      className="d-flex align-center justify-between cp"
    >
      <div className={'d-flex align-center truncate' + (currentChannel.url === c.url ? ' active' : '')}
        onClick={() => { currentChannelActions.set({ ...c }); }}>
        {currentChannel.url === c.url
          ? <PlayIcon />
          : <TvIcon />}
        <span className='ml-2 truncate' title={c.name}>{c.name}</span>
      </div>

      {/* <div onClick={() => { channelsActions.addToFavorites(c) }} title="Add to favorites">
        <span><HeartIcon color={channelsState.favorites.some(f => f.url == c.url) ? "#e91e63" : "#fff"} /></span>
      </div> */}
    </li>)}
  </ul>
}

export default React.memo(ListYt)