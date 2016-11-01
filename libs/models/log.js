(function(module){
  var BigQueryApi = require('../big_query/api');

  function Log() {
  }

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

