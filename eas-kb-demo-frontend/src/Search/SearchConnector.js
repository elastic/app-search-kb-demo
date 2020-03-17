import AppSearchAPIConnector from '@elastic/search-ui-app-search-connector';

const appSearchConnector = new AppSearchAPIConnector({
  endpointBase: process.env.REACT_APP_AS_ENDPOINT_BASE || 'http://localhost:3002',
  searchKey: process.env.REACT_APP_AS_SEARCH_API_KEY,
  engineName: process.env.REACT_APP_AS_ENGINE_NAME || 'helpdesk',
});

export default appSearchConnector;