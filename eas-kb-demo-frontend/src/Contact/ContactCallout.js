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

const Callout = (props) => {
  return <div className="contact__callout">
    <p className="contact__callout__title">Can’t find what you’re looking for?</p>
    <p className="contact__callout__content">
      We’re here to help. Get in touch and we’ll get back to you as soon as possible. {props.children}
    </p>
  </div>
};

export default Callout;
