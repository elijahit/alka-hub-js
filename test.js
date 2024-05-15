const moment = require('moment-timezone');

let data = moment().tz("Europe/London").hour();

console.log(data)