# Elastic App Search Knowledge Base Demo

## Usage

### Install dependencies

The project can be installed by running:

```bash
yarn install
```

### Starting the stack

The demo relies on Elastic App Search and you need the stack to be set up before being able to continue.

The easiest way to get the stack up and runing is to use the `docker-compose` file bundled with this demo:

```bash
docker-compose up -d
```

After the stack will have finished to start, you can then access to App Search through your browser at http://localhost:3002 with the following credentials:

- **login:** `app_search`
- **password:** `password`

**Notes :**

- This demo uses meta engine which are available only when using a Platinium license. <br/>
You have to start a new trial for your App Search instance using the following command:

```bash
docker-compose exec elasticsearch  curl -XPOST -uelastic:elasticpassword "localhost:9200/_license/start_trial?acknowledge=true"
docker-compose restart app-search
```
- When using Docker for Mac, please make sure you have at least 4GiB of memory allocated to Docker (`Preferences > Advanced`). <br />
  Out of memory errors can cause ElasticSearch or App Search container to be killed (`docker logs --tail` can help to detect it).

### Importing the data

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
    - App Search API private key: you can find it into the credentials section of the App Search dashboard (http://localhost:3002/as#/credentials)


### Frontend

Once the stack is running and your content has been imported, you can run the frontend by using:

```bash
yarn start
```
