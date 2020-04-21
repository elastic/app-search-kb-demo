# Elastic App Search Knowledge Base Demo

![eas-kb-demo](https://user-images.githubusercontent.com/786943/79903734-347d7300-83d9-11ea-8405-6b801fcd74ac.gif)

## Build and run frontend for testing

## Frontend only

If you wish to test the frontend only, you can build and run the frontend docker image, you can run the following command from the project root directory:

```bash
docker build . --target=frontend -t eas-kb-demo/frontend
docker run -p5000:5000 --rm --env-file=eas-kb-demo-frontend/.env eas-kb-demo/frontend
```

You can now use the frontend from your browser at http://host.docker.internal:5000.

**Note:**
- The docker build is a snapshot version of the production build to be deployed.
- Data from an ESS App Search instance
- If you want to develop the frontend, read the development documentation bellow.


## Full stack

If you wish to test the full stack build locally, you have to boot all the required services (Elasticsearch, App Search) using the `docker-compose.yml` config with the project.

```
docker-compose up -d
```

It could take few minutes, for the stack to be fully booted. Once finished, you should be able to access:
- App Search admin at http://host.docker.internal:3002 using `app_search`/ `password` credentials
- The frontend at http://host.docker.internal:5000

Note:
- All data are automatically imported when starting the stack. It can take few minutes before the result start to appear in the frontend.
- You can tune the engine relevance, curations, and synonyms by using the `helpdesk` meta engine in App Search.
- The docker-compose stack is not intended to develop but to test built images. Images need to be refreshed everytime a change is made to the code using `docker-compose build`.

If something goes wrong with the import (use `docker-compose logs -f dataimport` to view logs), you can restart it with:

```
docker-compose run dataimport start-dataimport.sh
```

To reset the whole stack (all data will be lost), use:

```
docker-compose down
```

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

To run cypress tests for the frontend, you can use:

```bash
yarn cypress run
```

### Data import development

#### Starting the stack

When working on the import, you should use your own version of App Search during the development.
The easiest way to get the stack up and running is to use the `docker-compose` file bundled with this demo:

```bash
docker-compose up -d
```

After the stack will have finished to start, you can then access to App Search through your browser at http://localhost:3002 with the following credentials:

- **login:** `app_search`
- **password:** `password`

**Notes :**

- This demo uses meta engine which are available only when using a Platinum license. <br/>
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

## License

[Apache-2.0](https://github.com/elastic/app-search-kb-demo/blob/master/LICENSE.txt) © [Elastic](https://github.com/elastic)
