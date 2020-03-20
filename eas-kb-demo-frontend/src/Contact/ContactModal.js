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
      <div className='contact__modal__content'>
        <div className="form-row">
          <label>Subject <input type="text"/></label>
        </div>
        <div className="form-row">
          <label>How can we help? <textarea></textarea></label>
        </div>
        <div className="form-row">
          <label>Email Address <input type="email"/></label>
          <div class="help-text">How do we get in touch with you?</div>
        </div>
        <div class="form-controls">
          <button onClick={onClose} class="button__primary">Send</button>
          <span> or </span>
          <button onClick={onClose} class="button__secondary">Cancel</button>
        </div>
      </div>
    </div>
  </div>
}

export default ContactModal;
