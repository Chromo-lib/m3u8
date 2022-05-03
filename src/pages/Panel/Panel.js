import React, { useCallback, useEffect, useState } from 'react';
import ListFavorites from './components/ListFavorites';
import VideoContainer from './components/VideoContainer';
import TvIcon from './icons/TvIcon';
import HeartIcon from './icons/HeartIcon';
import ListChannels from './components/ListChannels';
import Modal from './components/Modal';
import useChannels from './store/useChannels';

export default function Panel() {
  const [channelsState, channelsActions] = useChannels();

  const tabs = [
    { name: 'default', icon: <TvIcon /> },
    { name: 'favorites', icon: <HeartIcon /> }
  ];

  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    fetch(channelsState.url)
      .then(r => r.json())
      .then(chs => {
        channelsActions.setDefaultChannels(chs);
      })
      .catch(e => { });
  
    return () => {
      
    }
  }, [channelsState.url]);
  
  const onChangeTab = useCallback((index) => {    
    setTabIndex(index)
  }, []);

  return (<main>
    <VideoContainer />

    <aside className='br7'>
      <ul className='w-100 d-flex justify-between'>
        {tabs.map((tab, i) => <li
          key={i}
          className={'w-100 bg-yellow uppercase center' + (tabIndex === i ? ' bg-gray' : '')}
          title={tab.name}
          onClick={() => { onChangeTab(i) }}>
          {tab.icon}
        </li>)}
      </ul>

      {tabIndex === 0
        ? <ListChannels channels={channelsState.defaultChannels} />
        : <ListFavorites channels={channelsState.favorites} />}
    </aside>

    <Modal />
  </main>);
};
