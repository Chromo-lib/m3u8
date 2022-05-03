import React from 'react'
import useCurrentChannel from '../store/useCurrentChannel';
import TvIcon from '../icons/TvIcon';

export default function QualityInfo() {

  const [currentChannel] = useCurrentChannel();
  const qualityLevels = currentChannel.qualityLevels;
  const qualityIndex = currentChannel.qualityIndex;

  const index = qualityIndex > -1 ? qualityIndex : 0;

  if (qualityLevels.length && qualityLevels[index]) {
    return <div className='w-100'>

      <h3 className='w-100 d-flex align-center m-0 mb-1'>
        <TvIcon /><span className='ml-1'>{currentChannel.name}</span>
      </h3>

      <ul className='w-100 d-flex justify-between'>
        <li className='border-0'>Video Codec: {qualityLevels[index].videoCodec || '?'}</li>
        <li className='border-0'>Audio Codec: {qualityLevels[index].audioCodec || '?'}</li>
        <li className='border-0'>Height: {qualityLevels[index].height || '?'}</li>
        <li className='border-0'>Width: {qualityLevels[index].width || '?'}</li>
        <li className='border-0'>Quality: {qualityIndex > -1 ? qualityLevels[index].name : 'auto'}</li>
      </ul>

      <div className='w-100 d-flex align-center'>
        <input className='w-100' type="url" defaultValue={qualityLevels[index].url} readOnly />
      </div>
    </div>
  }
  else {
    return <></>
  }
}
