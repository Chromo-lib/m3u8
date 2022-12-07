import React, { useCallback, useEffect, useState } from 'react';
import ListFavorites from './components/ListFavorites';
import VideoContainer from './components/VideoContainer';
import TvIcon from './icons/TvIcon';
import HeartIcon from './icons/HeartIcon';
import ListChannels from './components/ListChannels';
import Modal from './components/Modal';
import useChannels from './store/useChannels';
import ListYt from './components/ListYt';
import Header from './components/Header';
import YoutubeIcon from './icons/YoutubeIcon';

export default function App() {
  const [channelsState, channelsActions] = useChannels();
  const [channel, setChannel] = useState('');
  const [tempChannels, setTempChannels] = useState(channelsState.defaultChannels);

  const tabs = [
    { name: 'Channels', icon: <TvIcon /> },
    { name: 'Youtube', icon: <YoutubeIcon /> },
    { name: 'Favorites', icon: <HeartIcon /> }
  ];

  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    channelsActions.load(channelsState.url)
      .then(channels => {
        setTempChannels(channels)
      })
  }, []);

  const onChangeTab = useCallback((index) => {
    setTabIndex(index)
  }, []);

  const onSearch = (e) => {
    try {
      const ch = e.target.value.toLowerCase();
      const filtered = channelsState.defaultChannels.filter(c => c.name.toLowerCase().includes(ch));
      setTempChannels(filtered);
      setChannel(ch);
    } catch (error) {
      setTempChannels([]);
      setChannel('')
    }
  }

  return (<main>
    <section>
      <div className='video-container'>
        <Header />        
        <VideoContainer />
      </div>
    </section>

    <aside className='br7'>
      <ul className='w-100 tabs d-flex justify-between'>
        {tabs.map((tab, i) => <li
          key={i}
          className={'w-100 uppercase center bg-' + (tabIndex === i ? 'yellow' : 'gray')}
          title={tab.name}
          onClick={() => { onChangeTab(i) }}>
          {tab.icon}
        </li>)}
      </ul>

      {tabIndex === 0 && <ListChannels channels={tempChannels}>
        <li className='p-0'>
          <input className='w-100 bg-inherit' type="text"
            name='channel'
            placeholder='BBC'
            value={channel}
            onChange={onSearch}
          />
        </li>
      </ListChannels>}

      {tabIndex === 1 && <ListYt channels={channelsState.iframeChannels} />}
      {tabIndex === 2 && <ListFavorites channels={channelsState.favorites} />}
    </aside>

    <Modal />
  </main>);
};
