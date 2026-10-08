import React from 'react';
import ChannelQualityList from './ChannelQualityList';
import useModal from '../store/useModal';
import PlusIcon from '../icons/PlusIcon';
import FormAddStream from '../forms/FormAddStream';

export default function Header() {
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

      <ChannelQualityList />
    </div>
  );
}
