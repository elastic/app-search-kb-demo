import React from 'react';

import { useState } from 'react';

import './assets/stylesheets/App.scss';

import { Footer, Header } from '../Layout';
import { ContactCallout, ContactLink, ContactModal } from '../Contact';
import { SearchContainer } from '../Search';

const App = () => {

  const [showHelpModal, setShowHelp] = useState(false)

  return <div className="app">
    <Header>
      <div className="layout__header__action">
      <ContactLink onClick={() => setShowHelp(true)} />
      </div>
    </Header>
    <div className="app__content">
      <SearchContainer />
      <ContactCallout><ContactLink onClick={() => setShowHelp(true)} /></ContactCallout>
      <Footer />
    </div>

    <ContactModal visible={showHelpModal} onClose={() => setShowHelp(false)}/>

  </div>
}

export default App;
