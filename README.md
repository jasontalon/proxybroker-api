# proxybroker-api
A simple REST API for [ProxyBroker](https://github.com/constverum/ProxyBroker)

## Motivation

I was looking for free proxy server IP addresses over the Internet and I was able to find a CLI utility called [ProxyBroker](https://github.com/constverum/ProxyBroker) which created with python.

I created this REST API to easily fetch the output from proxybroker instead of extending the proxybroker utility.

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
 3. Transpile Typescript
 ```
 npm run tsc
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
 
Sample output:
```
 [
  {
    "fullAddress": "157.245.124.217:3128",
    "ip": "157.245.124.217",
    "port": "3128",
    "summary": "<Proxy US 0.98s [HTTP: Transparent, HTTPS] 157.245.124.217:3128>\r"
  },
  {
    "fullAddress": "34.90.113.143:3128",
    "ip": "34.90.113.143",
    "port": "3128",
    "summary": "<Proxy US 0.72s [HTTP: Transparent, HTTPS] 34.90.113.143:3128>\r"
  },
  {
    "fullAddress": "50.195.157.73:8080",
    "ip": "50.195.157.73",
    "port": "8080",
    "summary": "<Proxy US 0.78s [HTTPS] 50.195.157.73:8080>\r"
  },
  {
    "fullAddress": "50.195.185.171:8080",
    "ip": "50.195.185.171",
    "port": "8080",
    "summary": "<Proxy US 0.92s [HTTP: Transparent, HTTPS] 50.195.185.171:8080>\r"
  },
  {
    "fullAddress": "159.89.138.73:80",
    "ip": "159.89.138.73",
    "port": "80",
    "summary": "<Proxy US 0.38s [HTTPS] 159.89.138.73:80>\r"
  },
  {
    "fullAddress": "23.237.173.102:3128",
    "ip": "23.237.173.102",
    "port": "3128",
    "summary": "<Proxy US 0.94s [HTTP: Transparent, HTTPS] 23.237.173.102:3128>\r"
  },
  {
    "fullAddress": "50.195.185.132:8080",
    "ip": "50.195.185.132",
    "port": "8080",
    "summary": "<Proxy US 0.95s [HTTP: Transparent] 50.195.185.132:8080>\r"
  },
  {
    "fullAddress": "66.90.255.99:8080",
    "ip": "66.90.255.99",
    "port": "8080",
    "summary": "<Proxy US 0.50s [HTTPS] 66.90.255.99:8080>\r"
  },
  {
    "fullAddress": "132.148.241.241:8888",
    "ip": "132.148.241.241",
    "port": "8888",
    "summary": "<Proxy US 1.78s [HTTP: Transparent, HTTPS] 132.148.241.241:8888>\r"
  },
  {
    "fullAddress": "172.93.199.90:3131",
    "ip": "172.93.199.90",
    "port": "3131",
    "summary": "<Proxy US 0.52s [HTTP: Transparent, HTTPS] 172.93.199.90:3131>\r"
  }
]
 ```
 
 ## Testing
 ```
 npm t
 ```
 
 ## Docker
 You can deploy this API to Docker by creating an image then run a container. See this [Dockerfile](https://github.com/jasontalon/proxybroker-api/blob/master/Dockerfile) for the build.
 
