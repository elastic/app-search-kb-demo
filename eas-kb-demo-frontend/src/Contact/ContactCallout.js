import React from 'react';

import './assets/stylesheets/Contact.scss';

const Callout = (props) => {
  return <div className="contact__callout">
    <p className="contact__callout__title">Can’t find what you’re looking for?</p>
    <p className="contact__callout__content">
      We’re here to help. Get in touch and we’ll get back to you as soon as possible. {props.children}
    </p>
  </div>
}

export default Callout;
