import React from 'react'
import useChannels from '../store/useChannels';
import useCurrentChannel from '../store/useCurrentChannel';
import PlayIcon from '../icons/PlayIcon';
import TvIcon from '../icons/TvIcon';
import TrashIcon from '../icons/TrashIcon';

export default function ListFavorites() {
  const [channelsState, channelsActions] = useChannels();
  const { favorites } = channelsState;
  const [currentChannel, currentChannelActions] = useCurrentChannel();

  if (favorites.length < 1) return <></>

  const onAddOrRemoveFromFavorites = (channel) => {
    if (channelsState.favorites.find(c => c.url === channel.url)) {
      channelsActions.removeFromFavorites(channel);
    }
    else {
      channelsActions.addToFavorites(channel)
    }
  }

  return <ul className='h-100 overflow list-tv'>
    {favorites.map((c, i) => <li key={i}
      className="d-flex align-center justify-between cp"
    >
      <div className={'d-flex align-center truncate' + (currentChannel.url === c.url ? ' active' : '')}
        onClick={() => { currentChannelActions.set({ ...c, qualityIndex: -1 }); }}>
        {currentChannel.url === c.url
          ? <PlayIcon />
          : <TvIcon />}
        <span className='ml-2 truncate' title={c.name}>{c.name}</span>
      </div>


      <div onClick={() => { onAddOrRemoveFromFavorites(c); }} title="Remove from favorites">
        <span><TrashIcon /></span>
      </div>
    </li>)}
  </ul>
}