'use strict';

const prompts = require('prompts');
const fs = require('fs');
const AppSearchClient = require('@elastic/app-search-node');
const cliProgress = require('cli-progress');
const moment = require('moment');

const BATCH_SIZE = 100;
const DATA_DIR_NAME = process.cwd() + '/data';
const DEFAULT_URL = 'http://localhost:3002/api/as/v1/';
const META_ENGINE_NAME = 'helpdesk';
const PROGRESS_BAR_FORMAT = '  Importing {filename} [{bar}] {percentage}% | ETA: {eta}s | {value}/{total}';
const PROGRESS_BAR_CONFIG = {
  clearOnComplete: false,
  hideCursor: true,
  format: PROGRESS_BAR_FORMAT,
};

const getClient = () => {
  return prompts(
    [
      {
        type: 'text',
        name: 'appSearchUrl',
        message: 'App Search Server URL:',
        initial: process.env.APP_SEARCH_URL || DEFAULT_URL,
      },
      {
        type: 'text',
        name: 'apiKey',
        message: 'App Search Private API key:',
        initial: process.env.APP_SEARCH_PRIVATE_KEY,
      },
    ]
  ).then(({apiKey, appSearchUrl}) => {
    return Promise.resolve(new AppSearchClient(undefined, apiKey, () => appSearchUrl));
  });
};

const getImportedFiles = () => {
  return new Promise((resolve, reject) => {
    return fs.readdir(DATA_DIR_NAME, (err, files) => {
      return err != null ? reject(err) : resolve(files.map(filename => {
        return {filename: DATA_DIR_NAME + '/' + filename, engine: filename.split('.')[0]};
      }));
    });
  });
};

const processDoc = (doc) => {
  if (doc.category) {
    doc.product_name = doc.category;
    doc.product_name_raw = doc.category;
    delete doc.category;
  }

  if (doc.date) {
    doc.date = moment(doc.date.match(/(.*?(am|pm))/)[0], 'MMMM DD, YYYY, H:mma').format();
  }

  if (doc.published_at) {
    doc.date = doc.published_at;
    delete doc.published_at;
  }

  return doc;
};

const importFile = (client, filename, engine, progressBar) => {
  return client.getEngine(engine)
    .catch(error => error.message === 'Not Found' ? client.createEngine(engine) : Promise.reject(error))
    .then(() => {
      const jsonData = require(filename);
      const fileProgressBar = progressBar.create(jsonData.length, 0);
      fileProgressBar.update(0, {filename: filename.padEnd(100)});
      var promise = Promise.resolve(engine);
      for (var i = 0; i < jsonData.length; i += BATCH_SIZE) {
        const docs = jsonData.slice(i, i + BATCH_SIZE).map(processDoc);
        promise = promise.then(() => {
          return client.indexDocuments(engine, docs).then(() => {
            fileProgressBar.increment(docs.length);
            return Promise.resolve(engine);
          });
        });
      }

      return promise;
    });
};

getClient().then(client => {
  const progressBar = new cliProgress.MultiBar(PROGRESS_BAR_CONFIG, cliProgress.Presets.shades_grey);

  getImportedFiles().then(files => {
    return Promise.all(files.map(({filename, engine}) => importFile(client, filename, engine, progressBar)));
  }).then(engines => {
    progressBar.stop();
    return client.getEngine(META_ENGINE_NAME)
      .then(() => {
        return client.addMetaEngineSources(META_ENGINE_NAME, engines).then(() => {
          console.log(`✔ Added source engines to the ${META_ENGINE_NAME} meta engine.`);
        });
      })
      .catch(() => {
        client.createMetaEngine(META_ENGINE_NAME, engines).then(() => {
          console.log(`✔ Created the ${META_ENGINE_NAME} meta engine.`);
        });
      });
  });
});
