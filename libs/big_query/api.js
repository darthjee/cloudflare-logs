(function(module){
  var BigQuery = require('google-cloud/node_modules/@google-cloud/bigquery'),
      Dataset = require('./dataset');

  function Api(config) {
    this.config = config;
  }

  var fn = Api.prototype;

  fn.connect = function() {
    this.connection = this.connection || this.startConnection();
    return this;
  }

  fn.startConnection = function() {
    return BigQuery(this.config);
  };

  fn.dataset = function(name) {
    return new Dataset(this.connection, name);
  };

  Api.default = null;

  module.exports = Api;
})(module);

