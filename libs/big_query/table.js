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
//      return console.log('Error while inserting data: %s', err);
    }
//    console.log('Response of insert into %s, %s', this.name, JSON.stringify(apiResponse, null, 2));
  };


  module.exports = Table;
})(module);

