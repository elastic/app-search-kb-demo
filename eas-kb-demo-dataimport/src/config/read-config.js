'use strict';

const prompts = require('prompts');

const DEFAULT_URL = 'http://localhost:3002/';
const DEFAULT_META_ENGINE_NAME = 'helpdesk';
const DEFAULT_LANGUAGE = 'en';

const BATCH_SIZE = 100;

const DATA_DIR_NAME = `${require('path').resolve(`${__dirname}/../..`)}/data`;
const API_BASE_PATH = '/api/as/v1/';

const PROGRESS_BAR_FORMAT = '  Importing {filename} [{bar}] {percentage}% | ETA: {eta}s | {value}/{total}';
const PROGRESS_BAR_CONFIG = {
  clearOnComplete: false,
  hideCursor: true,
  format: PROGRESS_BAR_FORMAT,
};

/**
 * Read config from environment variables.
 *
 * @returns {Promise<Object>} Config.
 */
const readFromEnvironment = () => {
  const { AS_BASE_URL: appSearchUrl, AS_PRIVATE_API_KEY: apiKey } = process.env;
  const config = { appSearchUrl, apiKey };

  if (appSearchUrl === undefined || apiKey === undefined) {
    return Promise.reject(config);
  }

  return Promise.resolve(config);
};

/**
 * Read config from the prompt.
 *
 * @returns {Promise<Object>} Config.
 */
const promptConfig = () => {
  const promptQuestions = [
    {
      type: 'text',
      name: 'appSearchUrl',
      message: 'App Search Server URL:',
      initial: process.env.AS_BASE_URL || DEFAULT_URL,
    },
    {
      type: 'text',
      name: 'apiKey',
      message: 'App Search Private API key:',
      initial: process.env.AS_PRIVATE_API_KEY,
    },
  ];

  return prompts(promptQuestions);
};

/**
 * Validate the config.
 *
 * @param {Onject} config              Config.
 * @param {string} config.appSearchUrl App Search API base URL
 * @param {string} config.appSearchUrl App Search API private key.
 *
 * @returns {Promise<Object>} Validated config.
 */
const validateConfig = ({ appSearchUrl, apiKey, ...config }) => {
  appSearchUrl = appSearchUrl.replace(/[\s/]+$/g, '');
  if (!appSearchUrl.endsWith(API_BASE_PATH)) {
    appSearchUrl = `${appSearchUrl}${API_BASE_PATH}`;
  }

  if (!appSearchUrl.startsWith('http')) {
    appSearchUrl = `http://${appSearchUrl}`;
  }

  if (!apiKey.startsWith('private-')) {
    return Promise.reject('Api key should start with "private-"');
  }

  return Promise.resolve({ appSearchUrl, apiKey, ...config });
};

/**
 * Read and validate the dataimport config.
 *
 * @returns {Promise<Object>} Validated config.
 */
const readConfig = () => {
  const defaultValues = {
    metaEngineName: DEFAULT_META_ENGINE_NAME,
    inputDir: DATA_DIR_NAME,
    language: DEFAULT_LANGUAGE,
    batchSize: BATCH_SIZE,
    progressBarConfig: PROGRESS_BAR_CONFIG,
  };

  return readFromEnvironment().catch(promptConfig).then(validateConfig).then(({ ...config }) => {
    return { ...defaultValues, ...config };
  });
};

module.exports = readConfig;
