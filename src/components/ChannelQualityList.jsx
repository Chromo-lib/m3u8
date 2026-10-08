import React, { useCallback } from 'react';
import useCurrentChannel from '../store/useCurrentChannel';

export default function ChannelQualityList() {
  const [currentChannel, currentChannelActions] = useCurrentChannel();
  const qualityLevels = currentChannel.qualityLevels;
  const qualityIndex = currentChannel.qualityIndex;

  const onChange = useCallback((event) => {
    currentChannelActions.setQualityIndex(Number(event.target.value));
  }, [currentChannelActions]);

  if (!qualityLevels?.length || currentChannel.type !== 'm3u8') return null;

  return (
    <label className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/65">
      <span className="hidden sm:inline">Quality</span>
      <select
        aria-label="Stream quality"
        className="max-w-[130px] rounded-xl border border-white/10 bg-zinc-800 px-2 py-2 text-xs text-white outline-none focus:border-[#eed75f]/60"
        value={qualityIndex}
        onChange={onChange}
      >
        <option value={-1}>Auto</option>
        {qualityLevels.map((level, index) => (
          <option key={`${level.height}-${level.bitrate}-${index}`} value={index}>
            {level.height ? `${level.height}p` : `Variant ${index + 1}`}
          </option>
        ))}
      </select>
    </label>
  );
}
