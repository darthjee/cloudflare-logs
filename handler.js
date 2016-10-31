var zoneId = process.env.ZONE_ID,
    authEmail = process.env.EMAIL,
    authKey = process.env.KEY;

var Cloudflare = require('./libs/cloudflare'),
    BigQueryApi = require('./libs/big_query/api');

const projectData = require('./auth.json');
const config = {
  projectId: projectData['project_id'],
  keyFilename: './auth.json'
};

BigQueryApi.default = new BigQueryApi(config).connect();

cloudflare = new Cloudflare(zoneId, authEmail, authKey);

cloudflare.fetchAll();
