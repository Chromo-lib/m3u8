import React, { useCallback } from 'react';
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
    } else {
      channelsActions.addToFavorites(channel);
    }
  };

  const onPlay = useCallback((channel) => {
    currentChannelActions.set({ ...channel, qualityIndex: -1 });
  }, [currentChannelActions]);

  return (
    <ul className="max-h-[260px] overflow-y-auto bg-zinc-950/20 lg:max-h-[calc(100vh-170px)]">
      {children}

      {channels && channels.length > 0 && channels.map((c, i) => (
        <li key={i} className="flex items-center justify-between border-b border-white/10 px-3 py-3 transition hover:bg-white/5">
          <div
            className={[
              'flex min-w-0 flex-1 cursor-pointer items-center gap-2',
              currentChannel.url === c.url ? 'text-[#eed75f]' : 'text-white'
            ].join(' ')}
            onClick={() => onPlay(c)}
          >
            {currentChannel.url === c.url ? <PlayIcon /> : <TvIcon />}
            <span className="truncate text-sm" title={c.name}>{c.name}</span>
          </div>

          <button
            type="button"
            className="ml-2 rounded-full p-1 text-white transition hover:bg-white/5"
            onClick={() => onAddOrRemoveFromFavorites(c)}
            title="Add to favorites"
          >
            <HeartIcon color={channelsState.favorites.some(f => f.url === c.url) ? '#e91e63' : '#fff'} />
          </button>
        </li>
      ))}
    </ul>
  );
}

export default ListChannels