import React from 'react';
import TimesIcon from '../icons/TimesIcon';
import useModal from '../store/useModal';

export default function Modal() {
  const [modalState, modalActions] = useModal();

  return <div className={'modal' + (modalState.show ? ' d-flex' : ' d-none')}>
    <button onClick={() => { modalActions.toggle(); }}><TimesIcon /></button>
    <div className='w-100 overflow'>
      <h3 className='mt-0 uppercase'>{modalState.title}</h3>
      {modalState.content}
    </div>
  </div>
}
