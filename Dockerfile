FROM node:12.6 as builder

WORKDIR /usr/src/app
RUN mkdir eas-kb-demo-dataimport eas-kb-demo-frontend
COPY package.json yarn.lock ./
COPY eas-kb-demo-dataimport/package.json ./eas-kb-demo-dataimport/
COPY eas-kb-demo-frontend/package.json ./eas-kb-demo-frontend/
RUN yarn install
COPY eas-kb-demo-frontend/ eas-kb-demo-frontend/
COPY eas-kb-demo-dataimport/ eas-kb-demo-dataimport/

RUN yarn build
RUN yarn run isolate-workspace -w eas-kb-demo-dataimport -o dist/dataimport && \
    cd dist/dataimport && \
    yarn install


FROM node:12.6 as dataimport
WORKDIR /usr/app
COPY --from=builder /usr/src/app/dist/dataimport/ .
COPY scripts/retrieve-credentials.sh /usr/local/bin/
COPY scripts/start-dataimport.sh /usr/local/bin/

CMD ["/usr/local/bin/start-dataimport.sh"]

FROM node:12.6 as frontend
RUN npm install -g serve
WORKDIR /usr/app

COPY --from=builder /usr/src/app/eas-kb-demo-frontend/build/ .
COPY scripts/retrieve-credentials.sh /usr/local/bin/
COPY scripts/start-frontend.sh /usr/local/bin/
COPY eas-kb-demo-frontend/env.sh /usr/local/bin/

CMD ["/usr/local/bin/start-frontend.sh"]