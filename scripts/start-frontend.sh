#!/bin/bash

set -e

if [[ -z "${AS_BASE_URL}" ]]; then
  echo "The environment variable AS_BASE_URL must be set to start the container."
  exit 1
fi

if [[ -z "${AS_SEARCH_API_KEY}" ]]; then
  if [[ -z "${AS_USERNAME}" ]] || [[ -z "${AS_PASSWORD}" ]]; then
    echo "The environment variable AS_SEARCH_API_KEY must be set to start the container."
    exit 1;
  fi
  source /usr/local/bin/retrieve-credentials.sh

  if [[ -z "${AS_SEARCH_API_KEY}" ]]; then
    echo "Unable to retrieve App Search credentials."
    exit 1;
  fi
fi

echo AS_BASE_URL=$AS_SEARCH_API_KEY >> .env
echo AS_SEARCH_API_KEY=$AS_SEARCH_API_KEY >> .env

/usr/local/bin/env.sh

exec serve -s
