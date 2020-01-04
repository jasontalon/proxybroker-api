# proxybroker-api
A simple REST API for [ProxyBroker](https://github.com/constverum/ProxyBroker)

## Motivation

I was looking for free proxy IP addresses over the Internet and I was able to find a CLI utility called [ProxyBroker](https://github.com/constverum/ProxyBroker) which created with python.

I created this REST API to easily fetch the output from proxybroker instead of extending the proxybroker app.

## Requirements

This API uses a number of components to work properly:

- [Node.Js](https://nodejs.org/en/download/) - LTS
- [Python](https://www.python.org/downloads/) - v3.5 or higher
- [ProxyBroker](https://github.com/constverum/ProxyBroker) - v0.3.2 or higher

## Installation
 * [ProxyBroker](https://github.com/constverum/ProxyBroker) - See [this link](https://github.com/constverum/ProxyBroker#installation) for installing ProxyBroker, assuming you installed Python as mentioned in the Requirements.
 
## Development

 1. Pull this repository from your development directory.
 ```
 git pull https://github.com/jasontalon/proxybroker-api.git
 ```
 2. Install NPM package.
 ```
 npm i
 ```
 3. (Optional) Create your .env file in the root development directory for default values
 ```
 PORT=<number, defaults to 8080>
 PROXY_GET_LIMIT=<number, defaults to 10>
 PROXY_COUNTRIES=<2 letter country code, defaults to US>
 PROXYBROKER_DIRECTORY=<directory proxybroker.exe, leave this blank assuming the proxybroker directory is present in environment variable path>
 ```
 4. Start the API Service.
 ```
 npm start
 ```
 
 ## Using the API
 Make an HTTP request. 
 ```
 curl -X GET 'http://localhost:8080/search?countries=US,CA&limit=5&types=HTTP,HTTPS&lvl=Transparent,Anonymous,High'
 ```
 Above example is requesting a bunch of IP proxy addresses from United States, and Canada. Limited only to 5 IP Proxy addresses.
 
 The output of the API is in JSON format.
 ```
 [
  {
    "ip": "69.15.2.22",
    "port": "8080",
    "summary": "US [HTTPS] 69.15.2.22:8080"
  },
  {
    "ip": "66.7.113.39",
    "port": "3128",
    "summary": "US [HTTPS] 66.7.113.39:3128"
  },
  {
    "ip": "149.56.133.81",
    "port": "3128",
    "summary": "CA [HTTPS] 149.56.133.81:3128"
  },
  {
    "ip": "149.56.106.104",
    "port": "3128",
    "summary": "CA [HTTPS] 149.56.106.104:3128"
  },
  {
    "ip": "198.199.85.139",
    "port": "3128",
    "summary": "US [HTTPS] 198.199.85.139:3128"
  }
]
 ```
 
 ## Testing
 ```
 npm t
 ```
 
 ## Docker
 You can deploy this API to Docker by creating an image then run a container. See this [Dockerfile](https://github.com/jasontalon/proxybroker-api/blob/master/Dockerfile) for the build.
 
