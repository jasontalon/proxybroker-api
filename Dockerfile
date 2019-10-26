FROM nikolaik/python-nodejs:python3.7-nodejs10

RUN pip install proxybroker

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . /usr/src/app

EXPOSE 8080

CMD [ "npm", "start" ]