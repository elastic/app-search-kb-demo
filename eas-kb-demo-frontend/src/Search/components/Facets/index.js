import React from 'react';

import { Facet } from "@elastic/react-search-ui";

import FacetOptionView from './FacetOptionView';
import FacetView from './FacetView';

const PageTypeFacet = (props) => {
  const facetOptionView = (props) => {
    const optionLabel = props.value === 'documentation' ? 'Documentation' : 'Discussions';
    return <FacetOptionView { ...props } label={optionLabel} />
  }
  const facetView = (props) => <FacetView { ...props } optionView={facetOptionView} />

  return (<Facet {...props} view={facetView} />)
}

const ProductFacet = (props) => {
  const facetOptionView = (props) => <FacetOptionView { ...props } />
  const facetView = (props) => <FacetView { ...props } optionView={facetOptionView} />
  return (<Facet {...props} view={facetView} />)
}

export { PageTypeFacet, ProductFacet }
