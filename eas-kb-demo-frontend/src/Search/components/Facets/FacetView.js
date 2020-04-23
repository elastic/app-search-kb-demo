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

import './Facets.scss';

const FacetView = (props) => {
  const { label, options, onSelect, onRemove, optionView, icon, values } = props

  const onShowAll = (ev) => {
    ev.preventDefault()
    onRemove(values[0])
  }

  const onSelectWithReset = (value) => {
    onRemove(values[0])
    onSelect(value)
  }

  return <div className="facet">
    <div className="facet__title">{label}</div>
    <ul className="facet__options">
      <li className={`facet__option ${values.length < 1 ? 'selected' : ''}`}>
        <a href="/" onClick={onShowAll} className='facet__option__link'>
          <span className="facet__option__link__text">All</span>
        </a>
      </li>
      {options.map(option => {
        return optionView({ onSelect: onSelectWithReset, onRemove: onRemove, icon:icon, key: option.value, ...option })
      })}
    </ul>
  </div>
};

export default FacetView;
