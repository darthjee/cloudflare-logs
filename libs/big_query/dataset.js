(function(module){
  var Table = require('./table');

  function Dataset(connection, name) {
    this.dataset = connection.dataset(name);
  }

  var fn = Dataset.prototype;

  fn.table = function(name) {
    return new Table(this.dataset, name);
  };

  module.exports = Dataset;
})(module);

