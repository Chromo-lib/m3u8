import React from 'react'

export default function QualityInfo({ qualityLevels, qualityIndex }) {

  const index = qualityIndex > -1 ? qualityIndex : 0;

  if (qualityLevels[index]) {
    return (<ul className='w-100 qualityLevels justify-between mt-1'>
      <li>Video Codec: {qualityLevels[index].videoCodec || '?'}</li>
      <li>Audio Codec: {qualityLevels[index].audioCodec || '?'}</li>
      <li>Height: {qualityLevels[index].height || '?'}</li>
      <li>Width: {qualityLevels[index].width || '?'}</li>
      <li>Quality: {qualityIndex > -1 ? qualityLevels[index].name : 'auto'}</li>
    </ul>)
  }
  else {
    return <></>
  }
}
