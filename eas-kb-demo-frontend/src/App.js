import React from 'react';

import logo from './assets/images/elastic-logo.svg';

import './assets/stylesheets/App.scss';

function App() {
  return (
    <>
      <header className="HelpDeskApp-header">
          <div className="HelpDeskApp-header-content">
            <img src={logo} className="HelpDeskApp-logo" alt="Elastic logo" />
          </div>
        </header>
      <div className="HelpDeskApp">
        <div className="HelpDeskApp-main-content">
          
        </div>
        <div className="HelpDeskApp-help">
          <p className="HelpDeskApp-help-title">Can’t find what you’re looking for?</p>
          <p className="HelpDeskApp-help-content">We’re here to help. Get in touch and we’ll get back to you as soon as possible. <a href="truc">Contact Support →</a></p>
        </div>
        <footer className="HelpDeskApp-footer">
          <p>Demo created for Elastic internal use only.</p>
        </footer>
      </div>
    </>
  );
}

export default App;
