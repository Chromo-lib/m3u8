import { createStore, createHook } from 'react-sweet-state';

const Store = createStore({
  initialState: {
    show: false,
    width: '250px'
  },

  actions: {
    toggle: () => ({ setState, getState }) => {
      setState({ ...getState(), show: !getState().show });
    },
  },

  name: 'useAside',
});

const useAside = createHook(Store);
export default useAside;