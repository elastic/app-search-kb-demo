/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *	http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

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
};

export default App;
