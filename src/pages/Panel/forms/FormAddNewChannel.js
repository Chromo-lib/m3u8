import React, { useState } from 'react';

import useChannels from '../store/useChannels';
import useCurrentChannel from '../store/useCurrentChannel';
import PlayIcon from '../icons/PlayIcon';
import PlusIcon from '../icons/PlusIcon';

export default function FormAddNewChannel() {
  const [currentChannel, currentChannelActions] = useCurrentChannel();
  const [channelsState, channelsActions] = useChannels();

  const initState = { name: '', url: '', type: 'm3u8' };
  const [newChannel, setNewChannel] = useState(initState);

  const onPlayChannelChange = e => {
    setNewChannel({ ...newChannel, [e.target.name]: e.target.value });
  }

  const onPlayChannel = e => {
    e.preventDefault();
    currentChannelActions.set(newChannel);
  }

  const onAddChannel = () => {
    if (newChannel.type === 'iframe') { channelsActions.addNewIframeChannel(newChannel); }
    else { channelsActions.addNew(newChannel); }
  }

  const onReset = () =>{
    setNewChannel(initState)
  }

  return <>
    <form className='w-100' id="form-add-new-channel" onSubmit={onPlayChannel}>
      <div className='w-100 mb-1'>
        <label></label>
        <input className='w-100 br7' type="url" name='url'
          value={newChannel.url}
          onChange={onPlayChannelChange}
          placeholder='https://f24hls-i.akamaihd.net/hls/live/221148/F24_AR_HI_HLS/master_900.m3u8'
          required
        />
      </div>

      <input className='br7' type="text" name="name"
        value={newChannel.name}
        onChange={onPlayChannelChange}
        placeholder='Enter channel name: CNN' required />

      <select className='bg-white br7 ml-1' name='type' value={newChannel.type} onChange={onPlayChannelChange}>
        <option value="m3u8">m3u8</option>
        <option value="mp4">mp4</option>
        <option value="webm">webm</option>
        <option value="iframe">iframe</option>
      </select>

      <div className='w-100 d-flex justify-between mb-1 mt-1'>
        <button className='w-100 shadow br7 mr-1' type='submit' title='Play'>
          <PlayIcon /><span className='ml-1'>Play</span>
        </button>

        <button className='w-100 shadow br7 ml-1 bg-red' type='reset' onClick={onReset}>Reset</button>
      </div>
    </form>

    <button className='w-100 bg-blue mr-2 shadow br7' onClick={onAddChannel} title="Add To Favorites">
      <PlusIcon />
      <span className='ml-2'>Add to favorites</span>
    </button>
  </>
}
