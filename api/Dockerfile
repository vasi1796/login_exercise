FROM node:latest

WORKDIR /usr/src/app
COPY package.json /usr/src/app
COPY package-lock.json /usr/src/app
RUN npm i -g ts-node typescript
RUN npm ci
COPY . /usr/src/app

EXPOSE 3000 9229