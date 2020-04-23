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

const fs = require('fs');
const jsonfile = require('jsonfile');

class InputFile {
  /**
   * Constructor.
   *
   * @param {string} dir      File directory.
   * @param {string} filename File name.
   */
  constructor(dir, filename) {
    this.dir = dir;
    this.filename = filename;
  }

  /**
   * Compute the engine name where data should be imported from the filename.
   *
   * @returns {string}
   */
  getEngineName() {
    return this.filename.split('.')[0];
  }

  /**
   * Promise containing all docs in from the input file.
   *
   * @returns {Promise<Object>}
   */
  getDocuments(documentProcessor) {
    return new Promise((resolve, reject) => {
      jsonfile.readFile(`${this.dir}/${this.filename}`, function(err, rawDocs) {
        if (err) {
          reject(`Unable to read file ${this.dir}/${this.filename}`);
        }

        resolve(documentProcessor ? rawDocs.map(documentProcessor) : documentProcessor);
      });
    });
  };
};

/**
 * Get list of input files to be imported from the data input directory.
 *
 * @param {Object} config
 * @param {string} config.inputDir
 *
 * @returns {Promise<InputFile[]>}
 */
const getImportedFiles = ({ inputDir }) => {
  return new Promise((resolve, reject) => {
    return fs.readdir(inputDir, (err, files) => {
      return err != null ? reject(err) : resolve(files.map(filename => new InputFile(inputDir, filename)));
    });
  });
};

module.exports = { getImportedFiles };
