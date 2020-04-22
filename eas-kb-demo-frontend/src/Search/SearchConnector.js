import AppSearchAPIConnector from '@elastic/search-ui-app-search-connector';

const appSearchConnector = new AppSearchAPIConnector({
  endpointBase: window._env_.AS_BASE_URL,
  searchKey: window._env_.AS_SEARCH_API_KEY,
  engineName: 'helpdesk'
});

export default appSearchConnector;