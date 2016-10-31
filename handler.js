var zoneId = process.env.ZONE_ID,
    authEmail = process.env.EMAIL,
    authKey = process.env.KEY;

var Cloudflare = require('./libs/cloudflare');

cloudflare = new Cloudflare(zoneId, authEmail, authKey);

cloudflare.fetchAll();
