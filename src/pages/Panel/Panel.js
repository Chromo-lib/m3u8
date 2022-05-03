import React, { useState } from 'react';
import ListFavorites from './components/ListFavorites';
import VideoContainer from './components/VideoContainer';
import TvIcon from './icons/TvIcon';
import HeartIcon from './icons/HeartIcon';
import ListChannels from './components/ListChannels';
import Modal from './components/Modal';

export default function Panel() {  
  const tabs = [
    { name: 'default', icon: <TvIcon />, content: <ListChannels /> },
    { name: 'favorites', icon: <HeartIcon />, content: <ListFavorites /> }
  ];

  const [tabIndex, setTabIndex] = useState(0);

  return (<main>
    <VideoContainer />

    <aside className='br7'>
      <ul className='w-100 d-flex justify-between'>
        {tabs.map((tab, i) => <li
          key={i}
          className={'w-100 bg-bleu uppercase center' + (tabIndex === i ? ' bg-light' : '')}
          title={tab.name}
          onClick={() => { setTabIndex(i) }}>
          {tab.icon}
        </li>)}
      </ul>

      {tabs[tabIndex].content}
    </aside>    

    <Modal />
  </main>);
};
