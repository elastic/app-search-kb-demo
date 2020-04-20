'use strict';

const { readConfig } = require('./config');
const { factory: clientFactory } = require('./client');
const { getImportedFiles } = require('./input/file');
const documentProcessor = require('./document/processor');
const cliProgress = require('cli-progress');

(async function() {
  try {
    const config = await readConfig();
    console.info(`✔ Config read sucessfully.`)

    const client = await clientFactory(config);
    console.info('✔ Connected to the App Search server successfully.');

    const importedFiles = await getImportedFiles(config);

    await Promise.all(importedFiles.map((inputFile) => {
      const engine = inputFile.getEngineName();
      return client.initEngine(engine, config.language)
        .then(engineData => {
          if (engineData.isNew === true) {
            console.info(`✔ Created ${engine} engine.`);
          } else {
            console.info(`✔ Using already existing ${engine} engine.`);
          }
          return Promise.resolve(engineData);
        }).catch(reason => Promise.reject(`Unable to initialiaze engine ${engine} (${reason})`))
    })).then(() => {
      const sourceEngines = importedFiles.map(_ => _.getEngineName());
      const { metaEngineName } = config;
      return client.initMetaEngine(metaEngineName, sourceEngines)
        .then((engineData) => {
          if (engineData.isNew === true) {
            console.info(`✔ Created ${metaEngineName} meta-engine.`);
          } else {
            console.info(`✔ Updated ${metaEngineName} meta-engine sources.`);
          }
          return Promise.resolve(engineData);
      })
    }).then(() => {
      const progressBar = new cliProgress.MultiBar(config.progressBarConfig, cliProgress.Presets.shades_grey);
      return Promise.all(importedFiles.map((inputFile) => {
        return inputFile.getDocuments(documentProcessor)
          .then(docs => {
            const fileProgressBar = progressBar.create(docs.length, 0);
            if (fileProgressBar) {
              fileProgressBar.update(0, {filename: inputFile.filename.padEnd(100)});
            }
            const progressCallback = (batchSize) => {
              if (fileProgressBar) {
                fileProgressBar.increment(batchSize);
              }
            }
            return client.importDocuments(inputFile.getEngineName(), docs, progressCallback).then(importStats => {
              if (!fileProgressBar) {
                console.info(`✔ Imported ${importStats.docs} documents from file ${inputFile.filename} into engine ${inputFile.getEngineName()}.`);
              }
            })
          });
      })).then(() => progressBar.stop());
    }).catch(reason => {
      throw reason;
    });
  } catch (reason) {
    console.error(`✘ Error: ${reason}`)
    process.exit(1);
  }
})();
