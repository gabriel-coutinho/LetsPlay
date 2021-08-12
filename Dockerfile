FROM node:lts-alpine

EXPOSE 3030

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

CMD ["npm", "run", "start"]

RUN npm config set registry https://registry.npmjs.org/

COPY package.json /app/package.json
RUN npm install --no-optional --verbose

RUN mkdir logs

COPY . /app
