import React from 'react'
import useCurrentChannel from '../store/useCurrentChannel';
import CaretDownIcon from '../icons/CaretDownIcon';

export default function ChannelQualityList() {

  const [currentChannel, currentChannelActions] = useCurrentChannel()
  const qualityLevels = currentChannel.qualityLevels;
  const qualityIndex = currentChannel.qualityIndex;

  const onChange = levelIndex => {
    currentChannelActions.setQualityIndex(levelIndex);
  }

  if (qualityLevels) {
    return <div className='dropdown'>

      <button>
        <span className='mr-1'>Quality:
          {qualityIndex > -1 && qualityLevels[qualityIndex]
            ? (qualityLevels[qualityIndex].height + 'p')
            : 'auto'}
        </span>
        <CaretDownIcon />
      </button>

      <ul label='Quality'>
        <li className={qualityIndex === -1 ? 'yellow' : ''} onClick={() => { onChange(-1) }}>auto</li>
        {qualityLevels.map((q, i) => <li
          className={qualityIndex === i ? 'yellow' : ''}
          key={i}
          onClick={() => { onChange(i) }}>{q.height}p</li>)}
      </ul>
    </div>
  }
  else {
    return <></>
  }
}
