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

import { PagingInfo, Paging, SearchBox, SearchProvider, Results, WithSearch } from "@elastic/react-search-ui";

import { ProductFacet, PageTypeFacet, ResultView } from './components';

import searchConnector from './SearchConnector';

import './stylesheets/Search.scss';

const queryBaseResultFields = {
  title: { raw: { }, snippet: { size: 200, fallback: true } },
  url: { raw : { } },
  date: { raw : { } },
  website_area: { raw: { } },
  product_version: { raw : { } },
  product_name: { raw : { } },
  author: { raw : { } }
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
      body: { raw: { }, snippet: { size: 200, fallback: true } }
    }
  },
  initialState: {
    resultsPerPage: 10
  }
}

const searchBarInputProps = { placeholder: 'Search...', 'data-testid': 'search-bar', autoFocus: true }

class HomeView extends React.Component {
  renderTitle() {
    return (
      <div className="search-container-home__title">
        <h1>Help Center</h1>
        <p>Skip the support line and search for your issue in our knowledgebase.</p>
      </div>
    )
  }

  autocompleteView({ autocompletedResults, getItemProps }) {
    return <div className='search-container__autocomplete'>
      {autocompletedResults.slice(0, 5).map((result) => {
        return <div {...getItemProps({key: result.id.raw, item: result})}>
          <ResultView result={result} className='search-container__autocomplete__result' />
        </div>
      })}
    </div>
  }

  renderSearchBox() {
    const autocompleteResultProps = { urlField: "url", titleField: "title", linkTarget: '_blank' }
    return (
      <div className="search-container__search-box-wrapper">
        <SearchBox inputProps={searchBarInputProps} autocompleteResults={autocompleteResultProps}  autocompleteView= {this.autocompleteView} />
      </div>
    )
  }

  render() {
    return (
      <div className="search-container search-container-home">
        {this.renderTitle()}
        {this.renderSearchBox()}
      </div>
    )
  }
}

class SearchResultView extends React.Component {
  renderSearchBox() {
    return <div className="search-container__search-box-wrapper">
      <SearchBox inputProps={searchBarInputProps} />
    </div>
  }

  renderFacets() {
    return <>
      <PageTypeFacet show={2} field="website_area" label="Type" />
      <ProductFacet show={30} icon={true} field="product_name" label="Product" />
    </>
  }

  resultView({ key, ...props }) {
    return <li key={key}>
      <ResultView {...props} className='search-container__search-result-layout__list__result' />
    </li>
  }

  renderResults() {
    return <Results className='search-container__search-result-layout__list' resultView={this.resultView}/>
  }

  render() {
    if (this.props.isLoading) {
      window.scrollTo(0, 0)
    }

    return <div className="search-container search-container-results">
      {this.renderSearchBox()}
      <div className="search-container__search-result-layout">
        <div className="search-container__search-result-layout__sidebar">
          {this.renderFacets()}
        </div>
        <div className="search-container__search-result-layout__main">
          {this.props.isLoading && <div className="search-container__search-result-layout__main__loading"></div>}
          {!this.props.isLoading && <>
            <PagingInfo />
            {this.renderResults()}
            <Paging />
          </>}
        </div>
      </div>
    </div>
  }
}

const SearchContainer = () => {
  return <SearchProvider config={searchProviderConfig}>
    <WithSearch mapContextToProps={(context) => context}>
      {({ resultSearchTerm, isLoading, wasSearched, ...props }) => {
        return resultSearchTerm.length || isLoading || wasSearched ? <SearchResultView {...props} isLoading={isLoading} /> : <HomeView />
      }}
    </WithSearch>
  </SearchProvider>
};

export default SearchContainer;
