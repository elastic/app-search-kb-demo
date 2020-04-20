'use strict';

const fs       = require('fs');
const jsonfile = require('jsonfile')

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
          reject(`Unable to read file ${this.dir}/${this.filename}`)
        }

        resolve(documentProcessor ? rawDocs.map(documentProcessor) : documentProcessor);
      })
    });
  }
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

module.exports = { getImportedFiles }