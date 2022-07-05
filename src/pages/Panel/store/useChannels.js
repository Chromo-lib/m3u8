import { createStore, createHook } from 'react-sweet-state';

const localFavorites = localStorage.getItem('favorites');
const favorites = localFavorites ? JSON.parse(localFavorites) : [];
const playlistURL = localStorage.getItem('playlist') || 'https://api.npoint.io/c6ee3f6b723c086b35af';
// https://bitbucket.org/!api/2.0/snippets/haikel/4Eq4ox/065fea1d6a2a37a229e465450b7d0e473400e129/files/m3u8.txt

const Store = createStore({
  initialState: {
    defaultChannels: [],
    iframeChannels: (() => {
      if (localStorage.getItem('iframe-channels')) return JSON.parse(localStorage.getItem('iframe-channels'))
      else return [{ name: 'Impossiblue to work from home', url: 'https://www.youtube.com/embed/jXFevxFOk7g', type: "iframe" }]
    })(),

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
      const favorites = getState().favorites.filter(c => c.url !== channel.url);
      setState({ ...getState(), favorites })
      localStorage.setItem('favorites', JSON.stringify(favorites));
    },
    setDefaultChannels: (defaultChannels) => ({ setState, getState }) => {
      setState({ ...getState(), defaultChannels });
    },
    load: (url) => async ({ setState, getState }) => {
      if (getState().loading === true) return;

      setState({ ...getState(), loading: true });

      const response = await fetch(url);
      const defaultChannels = await response.json();

      setState({ ...getState(), loading: false, defaultChannels, url });
      localStorage.setItem('playlist', url);
      return defaultChannels;
    },
    addNewIframeChannel: (channel) => ({ setState, getState }) => {
      const channels = getState().iframeChannels || [];
      if (channels.length < 1 || !channels.some(c => c.url === channel.url)) {
        channels.unshift(channel);
        setState({ ...getState(), channels })
        localStorage.setItem('iframe-channels', JSON.stringify(channels));
        window.location.reload();
      }
    },
  },

  name: 'useChannels',
});

const useChannels = createHook(Store);
export default useChannels;