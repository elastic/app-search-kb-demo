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

const productIconClassName = ({ value: productName }) => {
  return `product-icon product-icon__${productName.replace(/\s+/g, '-').toLowerCase()}`
};

const FacetOptionView = (props) => {
  const { value, selected, icon } = props
  const label = props.label || value
  const onRemove = (ev) => {
    ev.preventDefault()
    props.onRemove(value)
  }
  const onSelect = (ev) => {
    ev.preventDefault()
    props.onSelect(value)
  }

  return <li className={`facet__option ${selected ? 'selected' : ''}`}>
    <a href="/" onClick={selected ? onRemove : onSelect} className='facet__option__link'>
      {icon && <div className={productIconClassName({value})} />}
      <span className="facet__option__link__text">{label}</span>
    </a>
  </li>
};

export default FacetOptionView;