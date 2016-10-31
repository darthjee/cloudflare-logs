(function(module){
  function Table(dataset, name) {
    this.table = dataset.table(name);
  }

  module.exports = Table;
})(module);

