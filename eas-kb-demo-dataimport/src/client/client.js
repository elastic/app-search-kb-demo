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

'use strict';

const AppSearchClient = require('@elastic/app-search-node');

class Client {

  /**
   * Instantiate a new client from config.
   * The client is return as a promise only when a successful response to a ping is received.
   *
   * @param {Object} config
   *
   * @returns {Promise<Client>} Client as a promise.
   */
  static factory(config) {
    const client = new Client(config);
    return client.ping().then(() => Promise.resolve(client));
  }

  /**
   * Init the client from config.
   *
   * @param {Object} config              App Search Client config.
   * @param {string} config.apiKey       App Search Client API key.
   * @param {string} config.appSearchUrl App Search Client API endpoint base URL.
   * @param {number} config.batchSize    Batch size used by the client to import docs.
   */
  constructor({ apiKey, appSearchUrl, batchSize }) {
    this.client = new AppSearchClient(undefined, apiKey, () => appSearchUrl);
    this.batchSize = batchSize;
  }

  /**
   * Try to connect to the App Search backend with current config.
   *
   * @returns {Promise<boolean>} Ping result promise.
   */
  ping() {
    return this.client.listEngines()
      .then(() => Promise.resolve(true))
      .catch((_) => Promise.reject(`Unable to connect to App Search (URL: ${this.client.client.baseUrl})`));
  }

  /**
   * This method create an engine if it does not exists yet and return engine data.
   * If the engine already exists, the promise is resolved with engine data.
   *
   * @param {string} engine          Engine name.
   * @param {string} [language=null] Language (null for universal).
   *
   * @returns {Promive<Object} Engine data as a promise.
   */
  initEngine(engine, language) {
    return this.client.getEngine(engine).catch(({ message }) => {

      if (message === 'Not Found') {
        return this.client.createEngine(engine, { language })
          .catch(({ message }) => Promise.reject(`Unable to create engine ${engine}: ${message}`))
          .then((engineData) => { return { isNew: true, ...engineData }; });
      }

      return Promise.reject({ message });
    });
  }

  /**
   * This method create a meta engine if it does not exist yet and return engine data as a promise.
   * If the engine already exists, the promise is resolved when source engines have been added to the list.
   *
   * @param {string}   engineName    Meta engine name.
   * @param {string[]} sourceEngines Source engines list.
   *
   * @returns {Promive<Object} Engine data as a promise.
   */
  initMetaEngine(engineName, sourceEngines) {
    return this.client.getEngine(engineName).then((engineData) => {
      if (engineData.type !== 'meta') {
        return Promise.reject(`Engine ${engineName} already exists but is not a meta-engine`);
      }
      return Promise.resolve({engineData});
    }).catch((reason) => {
      if (typeof reason === 'string') {
        return Promise.reject(reason);
      }
      return this.client.createMetaEngine(engineName, sourceEngines).then((engineData) => {
        return Promise.resolve({isNew: true, ...engineData});
      }).catch(({ errorMessages: [message] }) => {
        return Promise.reject(`Unable to create meta engine ${engineName} (${message}).`);
      });
    }).then(engineData => {
      if (engineData.isNew !== true) {
        return this.client.addMetaEngineSources(engineName, sourceEngines)
          .then(_ => Promise.resolve(engineData))
          .catch(({ errorMessages: [message] }) => {
            return Promise.reject(`Error while updating meta-engine ${engineName} sources (${message}).`);
          });
      }
      return Promise.resolve(engineData);
    });
  }

  /**
   * Import documents into an engine.
   * The method automatically chunk the data to avoid too large requests.
   *
   * @param {string}   engineName       Target engine name.
   * @param {Object[]} documents        Documents to be imported.
   * @param {*}        progressCallback A callback called each time for each imported chunk.
   */
  async importDocuments(engineName, documents, progressCallback) {
    var importedDocs = 0;
    for (var i = 0; i < documents.length; i += this.batchSize) {
      const currentBatch = documents.slice(i, i + this.batchSize);
      try {
        const indexingResponse = await this.client.indexDocuments(engineName, currentBatch);

        importedDocs += indexingResponse.filter(({errors}) => errors.length === 0).length;

        if (progressCallback) {
          progressCallback(currentBatch.length);
        }

      } catch ({ errorMessages: [message], ...error }) {
        return Promise.reject(`Error while importing documents in engine ${engineName} (${message})`);
      }
    }

    return Promise.resolve({ engine: engineName, importedDocs });
  }

  /**
   * Return searchable doc count for the specified engine.
   *
   * @param {string} engineName Target engine name.
   */
  async getSearchableDocCount(engineName) {
    try {
      const searchResponse = await this.client.search(engineName, '', { page: { size: 1 } }).then();
      const { meta: { page: { total_results: docCount } } } = searchResponse;
      return Promise.resolve(docCount);
    } catch ({ errorMessages: [message], ...error }) {
      return Promise.reject(`Unable to retrieve searchable doc count for ${engineName} (${message})`);
    }
  }
}

module.exports = Client;
