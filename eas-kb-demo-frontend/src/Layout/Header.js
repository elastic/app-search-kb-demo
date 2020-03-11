import React from 'react';

import logo from './assets/images/elastic-logo.svg';

import './assets/stylesheets/Layout.scss';

const Header = () => {
  return <header className="app-header">
    <div className="app-header-content">
      <img src={logo} className="app-header-logo" alt="Elastic logo" />
    </div>
  </header>
}

export default Header