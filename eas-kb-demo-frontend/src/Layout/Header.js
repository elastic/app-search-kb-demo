import React from 'react';

import logo from './assets/images/elastic-logo.svg';

import './assets/stylesheets/Layout.scss';

const Header = () => {
  return <header className="layout__header">
    <div className="layout__header__content">
     <a href='/'><img src={logo} className="layout__header__logo" alt="Elastic logo" /></a> 
    </div>
  </header>
}

export default Header