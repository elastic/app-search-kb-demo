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

import React from 'react';

import './Result.scss';

const productIconClassName = ({ result }) => {
  const { product_name: productName } = result;
  return `product-icon ${productName ? `product-icon__${productName.raw.replace(/\s+/g, '-').toLowerCase()}` : ''}`
}

const ResultLink = ({ result, ...props }) => {
  const { title: { raw: title }, url: { raw: url } } = result
  return <a title={title} href={url} target="_blank" rel="noopener noreferrer" {...props}>
    {props.children}
  </a>
}

const getResultTitle = ({ result, className, onClickLink }) => {
  const {
    title: { snippet: title, raw: rawTitle },
    website_area: { raw: resultType }
  } = result

  return <div className={`${className}__title`}>
    {resultType === 'documentation' && <div className={productIconClassName({ result })}></div>}
    <div className={`${className}__title__text`}>
      {title && <ResultLink result={result} onClick={onClickLink} dangerouslySetInnerHTML={{ __html: title }}/>}
      {title === undefined && <ResultLink result={result} onClick={onClickLink}>{rawTitle}</ResultLink>}
    </div>
  </div>
}

const getResultContent = ({ result, className, onClickLink }) => {
  const {
    url: { raw: url },
    website_area: { raw: resultType },
    body: { snippet: body, raw: rawBody },
    product_version: productVersion,
    author
  } = result
  return <div className={`${className}__content`}>
    <div className={`${className}__meta`}>
      <div className={`${className}__meta__tags`}>
        <div className={`${className}__meta__tag`}>{resultType === 'documentation' ? 'Documentation' : 'Discussion'}</div>
        {productVersion !== undefined  && <div className={`${className}__meta__tag`}>{productVersion.raw}</div>}
      </div>
      {<div className={`${className}__content__url`}>
        <ResultLink result={result} onClick={onClickLink}>{url}</ResultLink>
      </div>}
    </div>

    {body && <p className={`${className}__content__text`} dangerouslySetInnerHTML={{ __html: body }} />}
    {body === undefined && <p className={`${className}__content__text`}>
      {rawBody}
    </p>}
    {resultType === 'discuss' && <div className={`${className}__content`}>
      Posted {author && author.raw && <>by <b>{author.raw}</b></>}
    </div>}
  </div>
}

const ResultView = ({className, result, ...props}) => <div className={`${className}`}>
  <div className={`${className}__type-${result.website_area.raw}`}>
    {getResultTitle({ result, className, ...props })}
    {getResultContent({ result, className, ...props })}
  </div>
</div>

export default ResultView;
