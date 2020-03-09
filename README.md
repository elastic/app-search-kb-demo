# Elastic App Search Knowledge Base Demo

## What is the Elastic App Search Knowledge Base Demo?

**TODO**

## Usage

## Starting the stack

The demo relies on Elastic App Search and you need the stack to be set up before being able to continue.

The easiest way to get the stack up and runing is to use the `docker-compose` file bundled with this demo:

```bash
docker-compose up -d
```

After the stack will have finished to start, you can then access to App Search through your browser at [http://localhost:3002] with the following credentials:

- **login:** `app_search`
- **password:** `password`

## Enabling meta engines

This demo uses meta engine which are available only when using a Platinium license.
You have to start a new trial for your App Search instance using the following command:

```bash
docker-compose exec elasticsearch  curl -XPOST -uelastic:elasticpassword "localhost:9200/_license/start_trial?acknowledge=true"
```

You can then restart App Search to make the change effective:

```bash
docker-compose restart app-search
```

## Importing the data

The demo uses two different data sources:
- data scrapped from the Elastic documentation (`dataimport/data/data/elastic-co-docs.json`)
- data scrapped from the Elastic discussion forum (`dataimport/data/data/elastic-co-discuss.json`)

You can import theses data into App Search by running:

```bash
yarn dataimport
```

**Notes:**
- The script will create one search engine in App Search for each dataset.
- The script will create one meta engine `helpdesk` that will be used to query all the dataset.
  If needed, relevance tunning should be done in the meta engine.
- You will need to information during the setup:
    - App Search API base URL: default is set to `http://localhost:3002/api/as/v1/` (should be fine)
    - App Search API private key: you can find it into the credentials section of the App Search dashboard ([http://localhost:3002/as#/credentials])


## Frontend

**TODO**