(function(module){
  var http = require('https');
  var _ = require("underscore");

  function Cloudflare(zoneId, authEmail, authKey) {
    this.zoneId = zoneId;
    this.authEmail = authEmail;
    this.authKey = authKey;
  }

  var fn = Cloudflare.prototype;

  fn.fetch = function() {
    http.get({
      hostname: 'api.cloudflare.com',
      path: '/client/v4/zones/' + this.zoneId + '/logs/requests' + this._params(),
      headers: this._headers()
    }, this._readResponse);
  };

  fn._params = function() {
    return '?count=1&start=' + this.startTime();
  };

  fn.startTime = function() {
    return Math.floor((new Date().getTime() / 1000) - 120)
  };

  fn._readResponse = function(response) {
    var body = '';
    response.on('end', function() {
      console.info(JSON.parse(body));
    });
    response.on('data', function(chunk) {
      body += chunk;
    });
  };

  fn._headers = function() {
    var headers = {};
    //headers['Accept-Encoding'] = 'gzip';
    headers['X-Auth-Email'] = this.authEmail;
    headers['X-Auth-Key'] = this.authKey;

    return headers;
  };

  module.exports = Cloudflare;
})(module);
