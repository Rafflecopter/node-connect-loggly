// node-connect-book/index.js
// Book logging middleware for connect

// This works a lot like the connect logger middleware.
// Tokens are things in the request and response we want to log.
// options are a list of tokens to log
var connectLogger = require('connect').logger;

var exports = module.exports = function bookMiddleware(log, options) {
  options = options || {};
  var defaultMethod = options.method && log[options.method] || log.debug;
  var extractor = buildExtractor(options.tokens || defaultTokens);

  return function (req, res, next) {
    res.on('close', function logRequest() {
      var packet = extractor(req, res)
      if (res.headerSent && (res.statusCode < 200 || res.statusCode > 299)) {
        log.error(packet);
      } else {
        defaultMethod(packet);
      }
    });

    next();
  }
}

function buildExtractor(tokenMap) {
  var tuples = Object.keys(tokenMap).map(function(key) {
    return [key, tokenMap[key], tokens[key]];
  });

  return function (req, res) {
    var packet = {};
    tuples.forEach(function (tuple) {
      packet[tuple[0]] = tuple[2](req, res, tuple[1]);
    });
    return packet
  }
}

var tokens = {
  url: connectLogger.url,
  method: connectLogger.method,
  'response-time': connectLogger['response-time'],
  date: connectLogger.date,
  status: connectLogger.status,
  referrer: connectLogger.referrer,
  'http-version': connectLogger['http-version'],
  'user-agent': connectLogger['user-agent'],
  'req': connectLogger['req'],
  'res': connectLogger['res']
}

var defaultTokens = {
  url: true,
  method: true,
  'response-time': true,
  date: true,
  status: true,
  'user-agent': true,
  'http-version': true
}

exports.token = function (name, getter) {
  tokens[name] = getter
}
