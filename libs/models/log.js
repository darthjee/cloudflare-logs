(function(module){
  var BigQueryApi = require('./libs/big_query/api'),
      table = BigQueryApi.default.dataset('cloudflare').table('logs');

  function Log() {
  }

  module.exports = Log;
})(module);

