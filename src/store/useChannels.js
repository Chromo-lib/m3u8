import { createStore, createHook } from 'react-sweet-state';

localStorage.removeItem('playlist');
localStorage.removeItem('iframe-channels');

const defaultChannel = {
  name: 'Buenísima TV',
  type: 'm3u8',
  url: 'https://canal.mediaserver.com.co/live/buenisimatv.m3u8'
};

const savedStreams = JSON.parse(localStorage.getItem('custom-streams') || '[]');
const customStreams = Array.isArray(savedStreams)
  ? savedStreams.filter((stream) =>
    stream &&
    typeof stream.name === 'string' &&
    typeof stream.url === 'string' &&
    stream.type === 'm3u8'
  )
  : [];
const defaultChannels = [
  defaultChannel,
  ...customStreams.filter((stream) => stream.url !== defaultChannel.url)
];
const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
const knownStreamUrls = new Set(defaultChannels.map((stream) => stream.url));
const favorites = Array.isArray(savedFavorites)
  ? savedFavorites.filter((favorite) => favorite && knownStreamUrls.has(favorite.url))
  : [];

const Store = createStore({
  initialState: {
    defaultChannels,
    favorites,
  },

  actions: {
    addStream: (channel) => ({ setState, getState }) => {
      const name = channel.name.trim();
      const url = channel.url.trim();
      let parsedUrl;

      try {
        parsedUrl = new URL(url);
      } catch {
        throw new Error('Enter a valid stream URL.');
      }

      if (!name) throw new Error('Enter a name for the stream.');
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        throw new Error('Stream URLs must use HTTP or HTTPS.');
      }

      const streams = getState().defaultChannels;
      if (streams.some((stream) => stream.url === url)) {
        throw new Error('This stream has already been added.');
      }

      const stream = { name, url, type: 'm3u8' };
      const defaultChannels = [...streams, stream];
      localStorage.setItem('custom-streams', JSON.stringify(
        defaultChannels.filter((item) => item.url !== defaultChannel.url)
      ));
      setState({ ...getState(), defaultChannels });
      return stream;
    },
    addToFavorites: (channel) => ({ setState, getState }) => {
      const favorites = [...getState().favorites];
      if (!getState().favorites.some(c => c.url === channel.url)) {
        favorites.unshift(channel);
        setState({ ...getState(), favorites })
        localStorage.setItem('favorites', JSON.stringify(favorites));
      }
    },
    removeFromFavorites: (channel) => ({ setState, getState }) => {
      const favorites = getState().favorites.filter(c => c.url !== channel.url);
      setState({ ...getState(), favorites })
      localStorage.setItem('favorites', JSON.stringify(favorites));
    },
  },

  name: 'useChannels',
});

const useChannels = createHook(Store);
export default useChannels;