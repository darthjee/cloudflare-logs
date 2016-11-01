(function(module){
  var _ = require("underscore");

  function Table(dataset, name) {
    this.table = dataset.table(name);
    this.name = name;

    _.bindAll(this, '_insertionError');
  }

  var fn = Table.prototype;

  fn.insert = function(rows) {
    this.table.insert(rows, this._insertionError);
  };
  
  fn._insertionError = function (err, insertErrors, apiResponse) {
    if (err) {
      return console.log('Error while inserting data: %s', err);
    }
    console.log('Response of insert into %s, %s', this.name, JSON.stringify(apiResponse, null, 2));
  };

  fn.select = function(select, callback) {
    query =  'SELECT ' + select + ' FROM ' + this.name;

    this.table.query({
      query: query
    }, function(err, response) {
      if (err) {
        return console.log('Error while running: "%s" %s', query, err);
      }
      callback(response);
    });
  };

  module.exports = Table;
})(module);

