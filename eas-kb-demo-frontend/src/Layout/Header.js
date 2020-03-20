import React from 'react';

import logo from './assets/images/elastic-logo.svg';

import './assets/stylesheets/Layout.scss';

const Header = (props) => {
  return <header className="layout__header">
    <div className="layout__header__content">
      <div className="layout__header__logo">
        <a href='/'><img src={logo} alt="Elastic logo" /></a> 
      </div>
      <div className="layout__header__actions">
        {props.children}
      </div>
    </div>
  </header>
}

export default Header