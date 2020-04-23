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

const { readConfig } = require('./config');
const { factory: clientFactory } = require('./client');
const { getImportedFiles } = require('./input/file');
const documentProcessor = require('./document/processor');
const cliProgress = require('cli-progress');

(async() => {
  try {
    const config = await readConfig();
    console.info('✔ Config read sucessfully.');

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
        }).catch(reason => Promise.reject(`Unable to initialiaze engine ${engine} (${reason})`));
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
        });
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
            };
            return client.importDocuments(inputFile.getEngineName(), docs, progressCallback).then(importStats => {
              if (!fileProgressBar) {
                const { docs: docsCount } = importStats.docs;
                const filename = inputFile.filename;
                const engineName = inputFile.getEngineName();
                console.info(`✔ Imported ${docsCount} documents from file ${filename} into engine ${engineName}.`);
              }
            });
          });
      })).then(() => progressBar.stop());
    }).catch(reason => {
      throw reason;
    });
  } catch (reason) {
    console.error(`✘ Error: ${reason}`);
    process.exit(1);
  }
})();
