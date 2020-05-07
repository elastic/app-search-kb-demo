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

const moment = require('moment');

/*eslint quote-props: ["error", "always"]*/
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
  'Elastic Cloud Enterprise': 'Elastic Cloud Enterprise',
  'Elastic Cloud on Kubernetes (ECK)': 'Elastic Cloud on Kubernetes',
  'Siem': 'SIEM',
  'Azure Marketplace And Resource Manager (ARM) Template': 'Cloud',
  'Enterprise Search': 'Workplace Search',
  'Rally': 'Elasticsearch',
  'Beats Developers': 'Beats',
  'Community Beats': 'Beats',
  'Central Management': 'Beats',
  'Machine Learning': 'Elasticsearch',
  'Elastic Logging Plugin': 'Beats',
  'Infrastructure': 'Elastic Stack',

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
