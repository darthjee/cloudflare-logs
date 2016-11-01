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

  module.exports = Log;
})(module);

