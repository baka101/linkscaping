##########################################################################
# Linkscaping
##########################################################################

Simple link status checker:
- enter URL for a web page
- linkscaping will look through all html <a> elements and do a get request for the URL
- output the result code of all the get requests and the url and page title

## Usage

Deployed on [www.linkscaping.com](http://www.linkscaping.com)

## Requirements

## Development

### Installing Dependencies

From within the root directory:

```sh
npm install
```

### Starting the server

From within the root directory:

```sh
nodemon server/app.js
```

open a browser and go to http://localhost:8080/