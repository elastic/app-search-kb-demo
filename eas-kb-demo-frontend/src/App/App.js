import React from 'react';

import './assets/stylesheets/App.scss';

import { Footer, Header } from '../Layout';
import { ContactCallout } from '../Contact';
import { SearchContainer } from '../Search';

class App extends React.Component {

  render() {
    return <div className="app">
      <Header />
      <div className="app-content">
        <SearchContainer />
        <ContactCallout />
        <Footer />
      </div>
    </div>
  }
}

export default App;
