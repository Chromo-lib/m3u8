import React from 'react';
import useChannels from '../store/useChannels';
import useModal from '../store/useModal';

const example = `[
  {
    "url": "https://siloh-ns1.plutotv.net/lilo/production/bein/master_1.m3u8",
    "name": "Bein Sport XTRA",
    "language': "en"
  }
]`;

export default function FormLoadFromUrl() {
  const [_, channelsActions] = useChannels();
  const [modalState, modalActions] = useModal();

  const onLoad = async e => {
    e.preventDefault();
    const url = e.target.elements[0].value;    
    await channelsActions.load(url);
    modalActions.toggle();
    window.location.reload()
  }

  return <>
    <form className='w-100' onSubmit={onLoad}>
      <input className='w-100 mb-1' type="url" name='url' placeholder='https://example.com/playlist' required />
      <button className='w-100' type='submit'>load</button>
    </form>

    <p className='mb-0'>Playlist object structure:</p>
    <pre className='w-100 br7 overflow'>{example}</pre>
  </>
}
