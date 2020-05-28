#!/bin/bash

set -e

function wait_for_as {
  local AS_BASE_URL=${AS_BASE_URL:-"http://localhost:3002"}
  local continue=1
  set +e
  while [ $continue -gt 0 ]; do 
    curl --connect-timeout 5 --max-time 10 --retry 10 --retry-delay 0 --retry-max-time 120 --retry-connrefuse -s -o /dev/null ${AS_BASE_URL}/login
    continue=$?
    if [ $continue -gt 0 ]; then
      sleep 1
    fi
  done
}

function load_api_keys {
  local AS_USERNAME=${AS_USERNAME:-"enterprise_search"}
  local AS_PASSWORD=${AS_PASSWORD:-"password"}
  local AS_BASE_URL=${AS_BASE_URL:-"http://localhost:3002"}
  local SEARCH_URL="${AS_BASE_URL}/as/credentials/collection?page%5Bcurrent%5D=1"
  echo $(curl -u${AS_USERNAME}:${AS_PASSWORD} -s ${SEARCH_URL} | sed -E "s/.*(${1}-[[:alnum:]]{24}).*/\1/")
}

echo "Waiting for App Search to be started..."
wait_for_as

echo "Connected to App Search."
export AS_BASE_URL=${AS_BASE_URL:-"http://localhost:3002"}

echo "Retrieve Search API key ..."
export AS_PRIVATE_API_KEY=`load_api_keys private`

echo "Retrieve Private API key ..."
export AS_SEARCH_API_KEY=`load_api_keys search`

unset -f load_api_keys
