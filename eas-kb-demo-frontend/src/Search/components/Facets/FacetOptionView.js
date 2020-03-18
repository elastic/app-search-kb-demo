import React from 'react';

import './Facets.scss';

const productIconClassName = ({ value: productName }) => {
  return `product-icon product-icon__${productName.replace(/\s+/g, '-').toLowerCase()}`
}

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

  return <li className='facet__option'>
    <a href="/" onClick={selected ? onRemove : onSelect} className='facet__option__link'>
      {icon && <div className={productIconClassName({value})} />}
      <span className="facet__option__link__text">{label}</span>
    </a>
  </li>
}

export default FacetOptionView;