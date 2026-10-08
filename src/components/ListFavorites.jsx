import React from 'react';
import useChannels from '../store/useChannels';
import useCurrentChannel from '../store/useCurrentChannel';
import PlayIcon from '../icons/PlayIcon';
import TvIcon from '../icons/TvIcon';
import TrashIcon from '../icons/TrashIcon';

export default function ListFavorites() {
  const [channelsState, channelsActions] = useChannels();
  const { favorites } = channelsState;
  const [currentChannel, currentChannelActions] = useCurrentChannel();

  if (favorites.length < 1) {
    return (
      <p className="px-4 py-8 text-center text-sm text-white/50">
        Your saved streams will appear here.
      </p>
    );
  }

  const onAddOrRemoveFromFavorites = (channel) => {
    if (channelsState.favorites.find(c => c.url === channel.url)) {
      channelsActions.removeFromFavorites(channel);
    } else {
      channelsActions.addToFavorites(channel);
    }
  };

  return (
    <ul className="max-h-[260px] overflow-y-auto bg-zinc-950/20 lg:max-h-[calc(100vh-170px)]">
      {favorites.map((c, i) => (
        <li key={i} className="flex items-center justify-between border-b border-white/10 px-3 py-3 transition hover:bg-white/5">
          <div
            className={[
              'flex min-w-0 flex-1 cursor-pointer items-center gap-2',
              currentChannel.url === c.url ? 'text-[#eed75f]' : 'text-white'
            ].join(' ')}
            onClick={() => currentChannelActions.set({ ...c, qualityIndex: -1 })}
          >
            {currentChannel.url === c.url ? <PlayIcon /> : <TvIcon />}
            <span className="truncate text-sm" title={c.name}>{c.name}</span>
          </div>

          <button
            type="button"
            className="ml-2 rounded-full p-1 text-white transition hover:bg-white/5"
            onClick={() => onAddOrRemoveFromFavorites(c)}
            title="Remove from favorites"
          >
            <TrashIcon />
          </button>
        </li>
      ))}
    </ul>
  );
}