(function(module){
  var _ = require("underscore"),
      BigQueryApi = require('../services/big_query/api'),
      Squasher = require('../utils/squasher'),
      querystring = require("querystring");

  function Log(json) {
    this.json = Squasher.squash(json)
  }

  var fn = Log.prototype;

  fn.enrich = function() {
    this.json.clientRequest_sslClientHello_extensions = this.parametrize(this.json.clientRequest_sslClientHello_extensions);
    console.info(this.json.clientrequest_headers);
    this.json.clientrequest_headers = this.parametrize(this.json.clientrequest_headers);
    this.json.edgerequest_headers = this.parametrize(this.json.edgerequest_headers);
    return this.json;
  };

  fn.parametrize = function(array) {
    _.map(array, function(element){
      return querystring.stringify(element);
    });
  };

  Log.insertBatch = function(rows) {
    this.getTable().insert(rows);
  };

  Log.getTable = function() {
    if(this.table) {
      return this.table
    } else {
      return this.table = BigQueryApi.default.dataset('cloudflare').table('logs');
    }
  }

  Log.lastTimestamp = function(callback) {
    this.getTable().select('max(timestamp) as timestamp', function(response) {
      var timestamp = null;
      if (response[0]) {
        timestamp = response[0].timestamp;
      }
      callback(timestamp);
    });
  };

  module.exports = Log;
})(module);

