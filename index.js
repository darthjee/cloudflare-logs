(function(module) {
  var Cloudflare = require('./libs/cloudflare'),
      BigQueryApi = require('./libs/big_query/api');

  module.exports = {
    handler: function() {
      const awsConfig = require('./aws.json');
      const projectData = require('./auth.json');
      const bigQueryConfig = {
        projectId: projectData['project_id'],
        keyFilename: './auth.json'
      };

      BigQueryApi.default = new BigQueryApi(bigQueryConfig).connect();

      cloudflare = new Cloudflare(awsConfig);

      cloudflare.fetchAll();
    }
  };
})(module);
