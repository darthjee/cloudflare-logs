(function(module){
  var http = require('https');
  var _ = require('underscore');

  function CloudflareApi(zoneId, authEmail, authKey) {
    this.zoneId = zoneId;
    this.authEmail = authEmail;
    this.authKey = authKey;
  }

  var fn = CloudflareApi.prototype;

  fn.logs = function(startTime, callback) {
    http.get({
      hostname: 'api.cloudflare.com',
      path: '/client/v4/zones/' + this.zoneId + '/logs/requests' + this._params(startTime),
      headers: this._headers()
    }, this._buildResponseParser(callback));
  };

  fn._params = function(startTime) {
    return '?count=10000&start=' + startTime;
  };

  fn._buildResponseParser = function(callback) {
    return function(response) {
      var body = '';
      response.on('end', function() {
        lines = body.split('\n');
        error = '';
        list = _.each(lines, function(line) {
          try {
            callback.call(this, JSON.parse(line));
          } catch(e) {
          }
        });
      });
      response.on('data', function(chunk) {
        body += chunk;
      });
    };
  };

  fn._headers = function() {
    var headers = {};
    //headers['Accept-Encoding'] = 'gzip';
    headers['X-Auth-Email'] = this.authEmail;
    headers['X-Auth-Key'] = this.authKey;

    return headers;
  };

  module.exports = CloudflareApi;
})(module);

