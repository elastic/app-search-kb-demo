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

import './assets/stylesheets/Contact.scss';

import { WithSearch, SearchProvider } from "@elastic/react-search-ui";

import searchConnector from '../Search/SearchConnector';

const searchProviderConfig = {
  apiConnector: searchConnector,
  autocompleteQuery: {
    suggestions: {
      types: { documents: { fields: ["product_name", "sections"] } },
      size: 6
    }
  }
};

const ContactModal = ({ visible, onClose }) => {
  const objectFieldRef = React.createRef();

  return <div className='contact__modal' aria-hidden={!visible}>
    <div className='contact__modal__overlay' onClick={onClose}></div>
    <div className='contact__modal__container'>
      <div className='contact__modal__title'>
        <a className='contact__modal__title__close' href="/" onClick={(ev) => {ev.preventDefault(); onClose();}}>Close</a>
        <h2>We’re here to help.</h2>
      </div>
      <div className='contact__modal__content'>
        <div className="form-row">
          <SearchProvider config={searchProviderConfig}>
            <WithSearch mapContextToProps={(context) => context}>
              {({ setSearchTerm, autocompletedSuggestions }) => {
                const onInputChange = (ev) => {
                  setSearchTerm(ev.target.value, {refresh: false, autocompleteSuggestions: true})
                }

                const hideSuggestions = () => {
                  setSearchTerm('', {refresh: false, autocompleteSuggestions: true});
                };

                const renderSuggestion = ({suggestion}, i) => {
                  const onCLick = (ev) => {
                    ev.preventDefault();
                    objectFieldRef.current.value = suggestion;
                    hideSuggestions();
                  }
                  return <dd key={i}><a href='/' onClick={onCLick}>{suggestion}</a></dd>
                };

                return <label>
                  <span>Subject</span>
                  <input ref={objectFieldRef} onChange={onInputChange} onBlur={hideSuggestions} type="text"/>
                  {autocompletedSuggestions.documents && autocompletedSuggestions.documents.length > 1 && <dl className="suggestions">
                    <dt>Recommended for you</dt>
                    {autocompletedSuggestions.documents.map(renderSuggestion)}
                  </dl>}
                </label>
              }}
            </WithSearch>
          </SearchProvider>
        </div>
        <div className="form-row">
          <label>How can we help? <textarea></textarea></label>
        </div>
        <div className="form-row">
          <label>Email Address <input type="email"/></label>
          <div className="help-text">How do we get in touch with you?</div>
        </div>
        <div className="form-controls">
          <button onClick={onClose} className="button__primary">Send</button>
          <span> or </span>
          <button onClick={onClose} className="button__secondary">Cancel</button>
        </div>
      </div>
    </div>
  </div>
};

export default ContactModal;
