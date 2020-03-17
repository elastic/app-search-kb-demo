import React from 'react';

import './Facets.scss';

const FacetView = (props) => {
  const { label, options, onSelect, onRemove, optionView } = props

  return <div className="facet">
    <div className="facet__title">{label}</div>
    <ul className="facet__options">
    {options.map(option => {
      return optionView({ onSelect: onSelect, onRemove: onRemove, key: option.value, ...option })
    })}
    </ul>
  </div> 
}

export default FacetView;