import React from 'react';
import CircleIcon from '../icons/CircleIcon';
import TimesIcon from '../icons/TimesIcon';
import useModal from '../store/useModal';

export default function Modal() {
  const [modalState, modalActions] = useModal();

  return <div className={'modal' + (modalState.show ? ' d-flex' : ' d-none')}>

    <header className='w-100 d-flex justify-between align-center'>
      <h3 className='m-0 uppercase d-flex align-center yellow'>
        <CircleIcon />
        <span className='ml-1'>{modalState.title}</span>
      </h3>
      
      <button className='p-0 bg-inherit yellow' onClick={() => { modalActions.toggle(); }}><TimesIcon /></button>
    </header>

    <div className='w-100 overflow'>{modalState.content}</div>
  </div>
}
