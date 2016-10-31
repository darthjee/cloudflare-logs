(function(module){
  var Table = require('./table');

  function Dataset(connection, name) {
    this.dataset = connection.dataset(name);
  }

  fn.table = function(name) {
    return new Table(this.dataset, name);
  };

  module.exports = Dataset;
})(module);

