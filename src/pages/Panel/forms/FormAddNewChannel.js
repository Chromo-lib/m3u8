import React, { useState } from 'react';

import useChannels from '../store/useChannels';
import useCurrentChannel from '../store/useCurrentChannel';
import PlayIcon from '../icons/PlayIcon';
import PlusIcon from '../icons/PlusIcon';

export default function FormAddNewChannel() {
  const [currentChannel, currentChannelActions] = useCurrentChannel();
  const [channelsState, channelsActions] = useChannels();

  const [newChannel, setNewChannel] = useState({ name: '', url: '', type: 'm3u8' });

  const onPlayChannelChange = e => {
    setNewChannel({ ...newChannel, [e.target.name]: e.target.value });
  }

  const onPlayChannel = e => {
    e.preventDefault();
    currentChannelActions.set(newChannel);
  }

  const onAddChannel = () => {
    channelsActions.addNew(newChannel);
  }

  return <>
    <h3 className='mt-0 uppercase'>Add New Channel</h3>

    <form className='w-100' onSubmit={onPlayChannel}>
      <div className='w-100'>
        <label></label>
        <input className='w-100' type="url" name='url'
          value={newChannel.url}
          onChange={onPlayChannelChange}
          placeholder='https://f24hls-i.akamaihd.net/hls/live/221148/F24_AR_HI_HLS/master_900.m3u8'
          required
        />
      </div>

      <input type="text" name="name"
        value={newChannel.name}
        onChange={onPlayChannelChange}
        placeholder='Enter channel name: CNN' required />

      <select name='type' value={newChannel.type} onChange={onPlayChannelChange}>
        <option value="m3u8">m3u8</option>
        <option value="mp4">mp4</option>
        <option value="webm">webm</option>
      </select>

      <button className='w-100 mb-1' type='submit' title='Play'>
        <PlayIcon />
        <span className='ml-2'>Play</span>
      </button>
    </form>

    <button className='w-100 bg-blue mr-2' onClick={onAddChannel} title="Add To Favorites">
      <PlusIcon />
      <span className='ml-2'>Add to favorites</span>
    </button>
  </>
}
