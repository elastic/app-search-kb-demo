import React from 'react';

import { PagingInfo, Paging, SearchBox, SearchProvider, Results, WithSearch } from "@elastic/react-search-ui";

import { ProductFacet, PageTypeFacet, ResultView } from './components'

import searchConnector from './SearchConnector';

import './stylesheets/Search.scss';

const queryBaseResultFields = { 
  title: { raw: { }, snippet: { size: 200, fallback: true } },
  url: { raw : { } },
  date: { raw : { } },
  website_area: { raw: { } },
  product_version: { raw : { } },
  product_name: { raw : { } },
  author: { raw : { } },
}

const queryFacets = {
  website_area: { type: "value", size: 10 },
  product_name: { type: "value", size: 30 }
}

const searchProviderConfig = {
  apiConnector: searchConnector,
  autocompleteQuery: {
    results: {
      result_fields: { ...queryBaseResultFields }
    }
  },
  searchQuery: {
    facets: { ...queryFacets },
    disjunctiveFacets: ['product_name', 'website_area'],
    result_fields: { 
      ...queryBaseResultFields,
      body: { raw: { } }
    }
  },
  initialState: {
    resultsPerPage: 10
  }
}

const SearchContainer = () => {

  const searchBarPlaceholder = 'Search ...'

  const homeView = <div className="search-container search-container-home">
    <div className="search-container-home__title">
      <h1>Need help?</h1>
      <p>Skip the support line and search for your issue in our knowledgebase.</p>
    </div>
    <div className="search-container__search-box-wrapper">
      <SearchBox inputProps={{ placeholder: searchBarPlaceholder }}
                 autocompleteResults={true}
                 autocompleteView={({ autocompletedResults, getItemProps }) => (
                  <div className='search-container__autocomplete'>
                    {autocompletedResults.slice(0, 5).map((result) => {
                      const { title: { raw: title }, url: { raw: url }} = result
                      return <div {...getItemProps({key: result.id.raw, item: result})}>
                        <ResultView result={result} className='search-container__autocomplete__result' />
                      </div>
                    })}
                  </div>
                 )} />
    </div>
  </div>

  const searchResultsView = <div className="search-container search-container-results">
    <div className="search-container__search-box-wrapper">
      <SearchBox inputProps={{ placeholder: searchBarPlaceholder }}/>
    </div>
    <div className="search-container__search-result-layout">
      <div className="search-container__search-result-layout__sidebar">
        <PageTypeFacet show={2} field="website_area" label="Type" />
        <ProductFacet show={30} icon={true} field="product_name" label="Product" />
      </div>
      <div className="search-container__search-result-layout__main">
        <PagingInfo />
        <Results className='search-container__search-result-layout__list' resultView={({ key, ...props }) => (
          <li key={key}>
            <ResultView {...props} className='search-container__search-result-layout__list__result' />
          </li>
        )}/>
        <Paging />
      </div>
    </div>
  </div>

  return <SearchProvider config={searchProviderConfig}>
    <WithSearch mapContextToProps={(context) => context}>
      {({ wasSearched }) => wasSearched ? searchResultsView : homeView}
    </WithSearch>
  </SearchProvider>
}

export default SearchContainer;