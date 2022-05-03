import React from 'react';

import ChannelQualityList from './ChannelQualityList';
import ChannelQualityInfo from './ChannelQualityInfo';
import PlusIcon from '../icons/PlusIcon';

import useModal from '../store/useModal';
import FormAddNewChannel from '../forms/FormAddNewChannel';
import InfoIcon from '../icons/InfoIcon';

export default function Header() {
  const [_, modalActions] = useModal();

  return <div className='w-100 d-flex justify-between mb-1'>
  <div>
    <button
      className='bg-inherit p-0'
      title="Play Or Add New Channel"
      onClick={() => { modalActions.setContent(<FormAddNewChannel />); }}>
      <PlusIcon />
      <span className='ml-1'>add new channel</span>
    </button>
  </div>

  <div className='d-flex align-center'>
    <span className='ml-2'></span>
    <ChannelQualityList />
    <span className='ml-2' onClick={() => { modalActions.setContent(<ChannelQualityInfo />); }}><InfoIcon /></span>
  </div>
</div>
}
