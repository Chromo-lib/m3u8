import React from 'react';
import useChannels from '../store/useChannels';
import useModal from '../store/useModal';

const st = `[
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
    await channelsActions.setURL(url);
    modalActions.toggle();
  }

  return <>
    <h3 className='mt-0 uppercase'>Load From Url</h3>
    <form className='w-100' onSubmit={onLoad}>
      <input className='w-100' type="url" name='url' placeholder='https://example.com/playlist' required />
      <button className='w-100' type='submit'>load</button>
    </form>

    <p className='mb-0'>Example of playlist object structure</p>
    <pre className='w-100 br7 overflow'>{st}</pre>
  </>
}
