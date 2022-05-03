import { createStore, createHook } from 'react-sweet-state';

const Store = createStore({
  initialState: {
    show: false,
    content: null,
    title: ''
  },

  actions: {
    toggle: () => ({ setState, getState }) => {
      setState({ ...getState(), show: !getState().show });
    },

    setContent: ({ title, content }) => ({ setState, getState }) => {
      setState({ ...getState(), show: true, title, content });
    },
  },

  name: 'useModal',
});

const useModal = createHook(Store);
export default useModal;