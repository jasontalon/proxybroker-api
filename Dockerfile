FROM nikolaik/python-nodejs:python3.7-nodejs12

WORKDIR /app

COPY . ./

RUN pip install proxybroker && \
npm install && \
npm run tsc

CMD [ "npm", "start" ]