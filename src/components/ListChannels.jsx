import React,{useCallback} from 'react';
import useChannels from '../store/useChannels';
import useCurrentChannel from '../store/useCurrentChannel';
import PlayIcon from '../icons/PlayIcon';
import TvIcon from '../icons/TvIcon';
import HeartIcon from '../icons/HeartIcon';

function ListChannels({ children, channels }) {
  const [channelsState, channelsActions] = useChannels();
  const [currentChannel, currentChannelActions] = useCurrentChannel();

  const onAddOrRemoveFromFavorites = (channel) => {
    if (channelsState.favorites.find(c => c.url === channel.url)) {
      channelsActions.removeFromFavorites(channel);
    }
    else {
      channelsActions.addToFavorites(channel)
    }
  }

  const onPlay = useCallback((channel) => {    
    currentChannelActions.set({ ...channel });
  },[currentChannel.url]);
  
  return <ul className='h-100 overflow list-tv'>
    {children}

    {channels && channels.length > 0 && channels.map((c, i) => <li key={i}
      className="d-flex align-center justify-between cp"
    >
      <div className={'d-flex align-center truncate' + (currentChannel.url === c.url ? ' active' : '')}
        onClick={() => { onPlay(c) }}>
        {currentChannel.url === c.url
          ? <PlayIcon />
          : <TvIcon />}
        <span className='ml-2 truncate' title={c.name}>{c.name}</span>
      </div>

      <div onClick={() => { onAddOrRemoveFromFavorites(c) }} title="Add to favorites">
        <span><HeartIcon color={channelsState.favorites.some(f => f.url == c.url) ? "#e91e63" : "#fff"} /></span>
      </div>
    </li>)}
  </ul>
}

export default ListChannels