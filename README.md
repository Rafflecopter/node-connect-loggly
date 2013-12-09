# connect-loggly

A [loggly](http://loggly.com) logger middleware for [connect](http://www.senchalabs.org/connect/).

This is a small piece of middleware to help you log important information about a request to loggly using their JSON api.

## Install

```
npm install connect-loggly --save
```

## Usage

```javascript
var loggly = require('loggly').createClient(myLogglyConfig)
  , connectLoggly = require('connect-loggly');

// If you are using express (otherwise just say `connect`)
express.use(connectLoggly(loggly))
```

## Advanced

You can change what the default message looks like. Like `connect.logger()`, this middleware deals in tokens which can be customly added using the `token` function. First, lets see how we can add new tokens:

```javascript
// Lets add some tokens!

// A user-id from the req.user object (this would work for mongoose/passport)
connectLoggly.token('user-id', function (req) {
  return req.user && req.user._id;
});

// A custom field from the session
connectLoggly.token('session', function (req, res, field) {
  return req.session && req.session[field];
});
```

And now we can change what the logged JSON is:

```javascript
var logglyRequestTokens = {
  // Default fields
  url: true,
  method: true,
  'response-time': true,
  date: true,
  status: true,
  'user-agent': true,
  'http-version': true,

  // Custom headers
  'req': 'Accepts',
  'res': 'Location',

  // Custom tokens (see below)
  'user-id': true,
  'session': 'someFieldInTheSession',

  // Static information
  'server-instance': 'abc123'
};

express.use(connectLoggly(logglyClient, logglyRequestTokens));
```

_Note_: Just be sure to add all custom tokens BEFORE setting up the middleware.

### Tokens List

- url (default) - URL
- method (default) - HTTP Method
- response-time (default) - Response time
- date (default) - UTC time
- status (default) - HTTP status
- referrer - Request header referrer
- http-version (default) - HTTP version
- user-agent (default) - Request header User Agent
- req (accepts field) - Arbitrary request header
- res (accepts field) - Arbitrary response header


## License

See LICENSE file
