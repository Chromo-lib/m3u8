import React from 'react';
import CircleIcon from '../icons/CircleIcon';
import TimesIcon from '../icons/TimesIcon';
import useModal from '../store/useModal';

export default function Modal() {
  const [modalState, modalActions] = useModal();

  return (
    <div
      className={[
        'fixed bottom-4 right-4 z-50 max-h-[80vh] w-[min(90vw,32rem)] overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl shadow-black/30',
        modalState.show ? 'flex flex-col' : 'hidden'
      ].join(' ')}
    >
      <header className="flex w-full items-center justify-between border-b border-white/10 px-4 py-3">
        <h3 className="m-0 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#eed75f]">
          <CircleIcon />
          <span>{modalState.title}</span>
        </h3>

        <button
          type="button"
          className="rounded-full p-1 text-[#eed75f] transition hover:bg-white/5"
          onClick={() => modalActions.toggle()}
        >
          <TimesIcon />
        </button>
      </header>

      <div className="w-full overflow-auto p-4 text-sm text-white/90">{modalState.content}</div>
    </div>
  );
}
