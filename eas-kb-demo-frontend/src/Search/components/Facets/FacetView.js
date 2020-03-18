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
}

export default FacetView;