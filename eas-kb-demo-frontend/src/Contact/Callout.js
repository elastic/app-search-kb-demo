import React from 'react';

import './assets/stylesheets/Contact.scss';

class Callout extends React.Component {

  render() {
    return <div className="app-contact-callout">
      <p className="app-contact-callout-title">Can’t find what you’re looking for?</p>
      <p className="app-contact-callout-content">
        We’re here to help. Get in touch and we’ll get back to you as soon as possible. <a href="">Contact Support →</a>
      </p>
    </div>
  }
}

export default Callout;
