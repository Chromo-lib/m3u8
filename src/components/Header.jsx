import React, { useCallback } from 'react';

import ChannelQualityList from './ChannelQualityList';
import FormAddNewChannel from '../forms/FormAddNewChannel';

import useModal from '../store/useModal';
import FormLoadFromUrl from '../forms/FormLoadFromUrl';
import About from './About';

import PlusIcon from '../icons/PlusIcon';
import LoadIcon from '../icons/LoadIcon';
import InfoIcon from '../icons/InfoIcon';
import EllipsisIcon from '../icons/EllipsisIcon';

export default function Header() {
  const [_, modalActions] = useModal();

  const onMenu = useCallback((e) => {
    const title = e.target.title || e.target.parentNode.title;

    switch (title) {
      case 'About':
        modalActions.setContent({ title: 'About', content: <About /> });
        break;

      case 'Play Or Add New Channel':
        modalActions.setContent({ title: 'Add New Channel', content: <FormAddNewChannel /> });
        break;

      case 'Load Channels From URL':
        modalActions.setContent({ title: 'Load From Url', content: <FormLoadFromUrl /> });
        break;

      default:
        break;
    }
  }, []);

  return <div className='w-100 d-flex justify-between'>
    <div className='dropdown'>

      <button><EllipsisIcon /> Menu</button>

      <ul className='max-content'>
        <li
          className='d-flex align-center'
          title="Play Or Add New Channel"
          onClick={onMenu}>
          <PlusIcon />
          <span className='ml-1'>add new channel</span>
        </li>

        <li
          className='d-flex align-center'
          title="Load Channels From URL"
          onClick={onMenu}>
          <LoadIcon />
          <span className='ml-1'>Load Channels From URL</span>
        </li>

        <li
          className='d-flex align-center'
          title="About"
          onClick={onMenu}>
          <InfoIcon />
          <span className='ml-1'>About</span>
        </li>
      </ul>
    </div>

    <div className='d-flex align-center'>
      <span className='ml-2'></span>
      <ChannelQualityList />
    </div>
  </div>
}
