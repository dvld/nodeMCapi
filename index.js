/*
  Primary API file

*/

// dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');

// Server responds to all requests with a string
var server = http.createServer(function (req, res) {

  // get the url and parse it
  var parsedUrl = url.parse(req.url, true);

  // get the path
  var path = parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // get query string as object
  var queryStringObject = parsedUrl.query;

  // get http method
  var method = req.method.toLowerCase();

  // get headers as an object
  var headers = req.headers;

  // get payload, if any
  var decoder = new StringDecoder('utf-8');
  var buffer = '';

  req.on('data', function (data) {
    buffer += decoder.write(data);
  });

  req.on('end', function () {
    buffer += decoder.end();

    // direct request to appropriate handler
    var chosenHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

    // construct data object to send to handler
    var data = {
      'trimmedPath': trimmedPath,
      'queryStringObject': queryStringObject,
      'method': method,
      'headers': headers,
      'payload': buffer
    };

    // route the request to specified handler
    chosenHandler(data, function (statusCode, payload) {
      // use called status code or default
      statusCode = typeof (statusCode) == 'number' ? statusCode : 200;

      // use called payload or default to empty object
      payload = typeof (payload) == 'object' ? payload : {};

      // convert payload to string
      var payloadString = JSON.stringify(payload);

      // send response
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);

      // log request path
      console.log('Returning this response: ', statusCode, payloadString);

    });
  });
});

// start server
server.listen(config.port, function () {
  console.log('the server is listening on port ' + config.port + ' in ' + config.envName + ' mode');
});

// define handlers
var handlers = {};

// sample handler
handlers.sample = function (data, callback) {
  // callback an http status code and payload object
  callback(406, { 'name': 'sample handler' });
};

// not found handler
handlers.notFound = function (data, callback) {
  callback(404);
};

// define request router
var router = {
  'sample': handlers.sample
};