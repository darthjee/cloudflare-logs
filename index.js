(function(module) {
  var Cloudflare = require('./libs/services/cloudflare'),
      BigQueryApi = require('./libs/services/big_query/api');

  module.exports = {
    handler: function() {
      const awsFile = './config/aws.json',
            projectFile = './config/auth.json',
            awsConfig = require(awsFile),
            projectData = require(projectFile),
            bigQueryConfig = {
              projectId: projectData['project_id'],
              keyFilename: projectFile
            };

      BigQueryApi.default = new BigQueryApi(bigQueryConfig).connect();

      cloudflare = new Cloudflare(awsConfig);

      cloudflare.fetchAll();
    }
  };
})(module);
