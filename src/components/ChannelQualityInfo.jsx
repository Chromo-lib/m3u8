import React from 'react'
import useCurrentChannel from '../store/useCurrentChannel';

export default function ChannelQualityInfo() {
  const [currentChannel] = useCurrentChannel();
  const qualityLevels = currentChannel.qualityLevels;
  const qualityIndex = currentChannel.qualityIndex;

  const index = qualityIndex > -1 ? qualityIndex : 0;

  if (qualityLevels.length && qualityLevels[index]) {
    
    return <ul className='d-flex align-center'>
      <li className='p-0 mr-2 border-0'>Video Codec: {qualityLevels[index].videoCodec || '?'}</li>
      <li className='p-0 mr-2 border-0'>Audio Codec: {qualityLevels[index].audioCodec || '?'}</li>
      <li className='p-0 mr-2 border-0'>Height: {qualityLevels[index].height || '?'}</li>
      <li className='p-0 mr-2 border-0'>Width: {qualityLevels[index].width || '?'}</li>
      <li className='p-0 mr-2 border-0'>bitrate: {qualityLevels[index].bitrate/1000 || '?'}Kps</li>
      <li className='p-0 mr-2 border-0'>Quality: {qualityIndex > -1 ? (qualityLevels[index].name || qualityLevels[index].height+'p') : 'auto'}</li>
    </ul>
  }
  else {
    return <></>
  }
}
