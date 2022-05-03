import { createStore, createHook } from 'react-sweet-state';

const Store = createStore({
  initialState: {
    show: false,
    content: null
  },

  actions: {
    toggle: () => ({ setState, getState }) => {
      setState({ ...getState(), show: !getState().show });
    },

    setContent: (content) => ({ setState, getState }) => {      
      setState({ ...getState(), show: !getState().show, content });
    },
  },

  name: 'useModal',
});

const useModal = createHook(Store);
export default useModal;