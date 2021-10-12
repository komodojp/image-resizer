# Basic
FROM node:lts-alpine as builder
WORKDIR /app

COPY ./package.json ./yarn.lock ./tsconfig.json ./

RUN yarn install --production --frozen-lockfile
RUN cp -R node_modules prod_node_modules
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# Release
FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /app

COPY ./package.json ./yarn.lock ./

COPY --from=builder /app/build ./build
COPY --from=builder /app/prod_node_modules ./node_modules

CMD [ "node", "./build/index.js" ]