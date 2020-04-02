# Elastic App Search Knowledge Base Demo


## Build and run for testing

To build and run the frontend docker image, you can run the following command from the root directory:

```bash
docker build . -t eas-kb-demo/frontend
docker run -p5000:5000 --rm eas-kb-demo/frontend
```

You can now use the frontend from your browser at http://localhost:5000.

**Note:**
- The docker build is a snapshot version of the production build to be deployed.
- Data from an ESS App Search instance. If you need data to be updated or some tuning, fill an issue.
- If you want to develop the frontend, read the development documentation bellow.


## Development

### Install dependencies

The project can be installed by running:

```bash
yarn install
```

### Frontend development

All sources of the frontend are located into the `eas-kb-demo-frontend` workspace of the main yarn project.

By default, the frontend is configured to use the production App Search instance deployed in Elastic Cloud.
Because frontend is a R/O application it should not be an issue.

To start the frontend, you can use:

```bash
yarn start
```

### Data import development

#### Starting the stack

When working on the import, you should use your own version of App Search during the development.
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

#### Importing the data

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
