"use strict";

const moment = require('moment');

const productNameMapping = {
  'Metricbeat': 'Beats',
  'Filebeat': 'Beats',
  'Clients': 'Elasticsearch',
  'Packetbeat': 'Beats',
  'Hadoop and Elasticsearch': 'Elasticsearch',
  'Libbeat': 'Beats',
  'Auditbeat': 'Beats',
  'Heartbeat': 'Beats',
  'Winlogbeat': 'Beats',
  'Journalbeat': 'Beats',
  'Functionbeat': 'Beats',
  'Logs': 'Logging',
  'Elastic Cloud Enterprise': 'Cloud ECE',
  'Elastic Cloud on Kubernetes (ECK)': 'ECK', 
  'Siem': 'SIEM',
  'Azure Marketplace And Resource Manager (ARM) Template': 'Cloud',
  'Enterprise Search': 'Workplace Search',
  'Rally': 'Elasticsearch',
  'Beats Developers': 'Beats',
  'Community Beats': 'Beats',
  'Central Management': 'Beats',
  'Machine Learning': 'Elasticsearch'
};

/**
 * Handle document processing (cleaning, value mapping, ...).
 * 
 * @param {Object} rawDocument Document to be processed.
 * 
 * @returns {Object}
 */
const processDocument = ({ title, date, published_at, category, product_name, product_name_raw, ...docFields }) => {
  
  // pubished_at field is removed in favor of the date field.
  if (published_at) {
    date = published_at;
  }

  // Parse the date field
  if (date && date.match(/(.*?(am|pm))/)) {
    date = moment(date.match(/(.*?(am|pm))/g)[0], 'MMMM DD, YYYY, H:mma').format();
  }

  // Move content of the category field in product_name
  if (category) {
    product_name = category;
  }

  // Keep only the first product_name value and map the value.
  if (product_name) {
    if (Array.isArray(product_name)) {
      product_name = product_name[0];
    }

    if (productNameMapping[product_name]) {
      product_name = productNameMapping[product_name];
    }
  }

  // Parse title to remove breadcrumbs or sections data from it.
  title = title.replace(/\[.*\]/g, '')
    .replace(/\| .* Reference/g, '')
    .replace(/\| Getting Started/g, '')
    .replace(/\| Elastic Stack Overview/g, '');

  return { title, date, product_name, ...docFields };
};

module.exports = processDocument;