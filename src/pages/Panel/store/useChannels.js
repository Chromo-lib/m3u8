import { createStore, createHook } from 'react-sweet-state';

const localFavorites = localStorage.getItem('favorites');
const favorites = localFavorites ? JSON.parse(localFavorites) : [];
const playlistURL = localStorage.getItem('playlist') || 'https://api.npoint.io/c6ee3f6b723c086b35af';

const Store = createStore({
  initialState: {
    defaultChannels: [],
    favorites,
    loading: false,
    url: playlistURL
  },

  actions: {
    addNew: (channel) => ({ setState, getState }) => {
      const favorites = [...getState().favorites];
      if (channel.url.length > 15 && !getState().favorites.some(c => c.url === channel.url)) {
        favorites.unshift(channel);
        setState({ ...getState(), favorites })
        localStorage.setItem('favorites', JSON.stringify(favorites));
      }
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
      const favorites = [...getState().favorites].filter(c => c.url !== channel.url);
      setState({ ...getState(), favorites })
      localStorage.setItem('favorites', JSON.stringify(favorites));
    },
    setDefaultChannels: (defaultChannels) => ({ setState, getState }) => {
      setState({ ...getState(), defaultChannels });
    },
    setURL: (url) => async ({ setState, getState }) => {
      if (getState().loading === true) return;

      setState({ ...getState(), loading: true });
      const response = await fetch(url);
      const defaultChannels = await response.json();
      setState({ ...getState(), loading: false, defaultChannels, url });
      localStorage.setItem('playlist', url);
      return defaultChannels;
    },
  },

  name: 'useChannels',
});

const useChannels = createHook(Store);
export default useChannels;