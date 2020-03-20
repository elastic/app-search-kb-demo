import React from 'react';

import './assets/stylesheets/Contact.scss';

const ContactModal = ({ visible, onClose }) => {
  return <div className='contact__modal' aria-hidden={!visible}>
    <div className='contact__modal__overlay' onClick={onClose}></div>
    <div className='contact__modal__container'>
      <div className='contact__modal__title'>
        <a className='contact__modal__title__close' href="/" onClick={(ev) => {ev.preventDefault(); onClose();}}>Close</a>
        <h2>We’re here to help.</h2>
      </div>
      <div className='contact__modal__content'></div>
    </div>
  </div>
}

export default ContactModal;
