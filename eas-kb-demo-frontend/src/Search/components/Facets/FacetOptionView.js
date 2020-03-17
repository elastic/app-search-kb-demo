import React from 'react';

import './Facets.scss';

const FacetOptionView = (props) => {
  const { value, selected } = props
  const label = props.label || value
  const onRemove = (ev) => {
    ev.preventDefault()
    props.onRemove(value)
  }
  const onSelect = (ev) => {
    ev.preventDefault()
    props.onSelect(value)
  }
  return <li className='facet__option'>
    {selected && <span className='facet__option__label'>
      {label} <a href="/" className='facet__option__remove'onClick={onRemove}>Remove</a>
    </span>}
    {!selected && <span className='facet__option__link'>
      <a href="/" onClick={onSelect}>{label}</a>
    </span>}
  </li>
}

export default FacetOptionView;