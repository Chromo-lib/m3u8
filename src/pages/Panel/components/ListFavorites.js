import React from 'react'
import useChannels from '../store/useChannels';
import useCurrentChannel from '../store/useCurrentChannel';
import PlayIcon from '../icons/PlayIcon';
import TvIcon from '../icons/TvIcon';
import TrashIcon from '../icons/TrashIcon';

export default function ListFavorites() {
  const [channels, channelsActions] = useChannels();
  const { favorites } = channels;

  const [currentChannel, currentChannelActions] = useCurrentChannel();

  return <ul className='h-100 overflow list-tv'>
    {favorites.length && favorites.map((c, i) => <li key={i}
      className="d-flex align-center justify-between cp"
    >
      <div className={'d-flex align-center truncate' + (currentChannel.url === c.url ? ' active' : '')}
        onClick={() => { currentChannelActions.set({ ...c, qualityIndex: -1 }); }}>
        {currentChannel.url === c.url
          ? <PlayIcon />
          : <TvIcon />}
        <span className='ml-2 truncate' title={c.name}>{c.name}</span>
      </div>


      <div onClick={() => { channelsActions.removeFromFavorites(c) }} title="Remove from favorites">
        <span><TrashIcon /></span>
      </div>
    </li>)}
  </ul>
}
