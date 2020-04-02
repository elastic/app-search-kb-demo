FROM node:12.6 as builder

WORKDIR /usr/src/app
RUN mkdir eas-kb-demo-dataimport eas-kb-demo-frontend
COPY package.json yarn.lock ./
COPY eas-kb-demo-dataimport/package.json ./eas-kb-demo-dataimport/
COPY eas-kb-demo-frontend/package.json ./eas-kb-demo-frontend/
RUN yarn install
COPY . .
RUN yarn build

FROM node:12.6 as frontend
RUN npm install -g serve
WORKDIR /usr/app

COPY --from=builder /usr/src/app/eas-kb-demo-frontend/build/ .

CMD ["serve", "-s", "." ]