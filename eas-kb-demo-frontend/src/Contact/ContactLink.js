import React from 'react';

import './assets/stylesheets/Contact.scss';

const ContactLink = ({ onClick }) => {

  const onShowModal = (ev) => {
    ev.preventDefault();
    onClick();
  }

  return <a className='contact__link' onClick={onShowModal} href="/">Contact Support</a>
}

export default ContactLink;
