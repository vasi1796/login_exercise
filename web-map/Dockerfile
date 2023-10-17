FROM node:18-alpine

RUN mkdir -p /usr/web-map
WORKDIR /usr/web-map
COPY . /usr/web-map
RUN npm install

EXPOSE 4200

CMD [ "npm", "start" ]
