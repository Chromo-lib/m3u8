import React from 'react';
import ChannelQualityList from './ChannelQualityList';
import useModal from '../store/useModal';
import PlusIcon from '../icons/PlusIcon';
import FormAddStream from '../forms/FormAddStream';

export default function Header({ channelName, isRecording, recordingError, onToggleRecording }) {
  const [, modalActions] = useModal();

  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-2 rounded-2xl border border-white/10 bg-zinc-900/80 px-3 py-2 shadow-lg shadow-black/10">
      <button
        type="button"
        className="flex items-center gap-2 rounded-xl bg-[#eed75f] px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#111] transition hover:opacity-90"
        onClick={() => modalActions.setContent({
          title: 'Add HLS stream',
          content: <FormAddStream />
        })}
      >
        <PlusIcon />
        <span>Add stream</span>
      </button>

      <div className="flex min-w-0 flex-1 flex-wrap items-center justify-center gap-2 px-2 sm:justify-start">
        <span className="truncate text-xs font-bold uppercase tracking-[0.14em] text-white">
          {channelName}
        </span>
        {isRecording && (
          <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-red-300">
            Recording
          </span>
        )}
        {recordingError && (
          <span role="alert" className="basis-full text-center text-[10px] text-red-200 sm:text-left">
            {recordingError}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <ChannelQualityList />
        <button
          type="button"
          className={[
            'whitespace-nowrap rounded-xl px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] transition hover:opacity-90',
            isRecording ? 'bg-red-500 text-white' : 'border border-white/10 bg-white/5 text-white/90 hover:bg-white/10'
          ].join(' ')}
          onClick={onToggleRecording}
        >
          {isRecording ? 'Stop & download' : 'Record stream'}
        </button>
      </div>
    </div>
  );
}
