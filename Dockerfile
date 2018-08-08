FROM node:10-alpine
MAINTAINER Jan-Lukas Else (https://about.jlelse.de)

COPY . /app
WORKDIR /app

RUN npm install
CMD ["npm", "start"]
