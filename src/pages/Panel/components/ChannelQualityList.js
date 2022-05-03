import React from 'react'
import useCurrentChannel from '../store/useCurrentChannel'

export default function ChannelQualityList() {

  const [currentChannel, currentChannelActions] = useCurrentChannel()
  const qualityLevels = currentChannel.qualityLevels;

  const onChange = e => {
    currentChannelActions.setQualityIndex(e.target.value);
  }

  if (qualityLevels) {
    return <select className='bg-inherit p-0' name="quality" onChange={onChange}>
      <optgroup label='Quality'>
        <option value="-1">auto</option>
        {qualityLevels.map((q, i) => <option key={i} value={i}>{q.name}</option>)}
      </optgroup>
    </select>
  }
  else {
    return <></>
  }
}
