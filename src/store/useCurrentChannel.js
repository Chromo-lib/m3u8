import { createStore, createHook } from 'react-sweet-state';

const defaultChannel = {
  name: 'Buenísima TV',
  type: 'm3u8',
  url: 'https://canal.mediaserver.com.co/live/buenisimatv.m3u8'
};

localStorage.setItem('current-channel', JSON.stringify(defaultChannel));

const localQualityIndex = localStorage.getItem('quality') || -1;
const localChannel = localStorage.getItem('current-channel');
const channel = localChannel ? JSON.parse(localChannel) : defaultChannel;
const safeChannel = channel && channel.url === defaultChannel.url ? channel : defaultChannel;

const Store = createStore({
  initialState: {
    ...safeChannel,
    qualityIndex: +localQualityIndex, // auto: -1
    qualityLevels: []
  },

  actions: {
    set: (channel) => ({ setState, getState }) => {
      const currentChannel = getState();
      const isNewStream = channel.url && channel.url !== currentChannel.url;
      const nextChannel = {
        ...currentChannel,
        ...channel,
        ...(isNewStream ? { qualityIndex: -1, qualityLevels: [] } : {})
      };

      setState(nextChannel);
      if (isNewStream) localStorage.setItem('quality', '-1');
      localStorage.setItem('current-channel', JSON.stringify(nextChannel));
    },
    setQualityLevels: (qualityLevels) => ({ setState, getState }) => {
      setState({ ...getState(), qualityLevels });
    },
    setQualityIndex: (qualityIndex) => ({ setState, getState }) => {
      setState({ ...getState(), qualityIndex });
      localStorage.setItem('quality', qualityIndex);
    },
  },

  name: 'useCurrentChannel',
});

const useCurrentChannel = createHook(Store);
export default useCurrentChannel;