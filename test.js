const cc = require('currency-codes');
const ccData = require('currency-codes/data');

const moment = require('moment-timezone');

const zone = moment.tz.zone('America/Chicago');

// console.log(test)

// const now = Date.now();

// console.log(now);

// const summer = new Date(2019, 6, 10, 12);

// console.log(summer.getTime())

// const nowOffset = zone.utcOffset(now);

// const summerOffset = zone.utcOffset(summer);

// console.log(nowOffset)
// console.log(summerOffset)
// const sumOffHrs = summerOffset / 60;
// console.log(sumOffHrs);


// const UTCsummer = new Date(summer);

// const UTCsummer2 = new Date(summer);

// UTCsummer.setUTCHours(12);

// UTCsummer2.setUTCHours(12+sumOffHrs);


// console.log(summer.getTime());
// console.log(UTCsummer.getTime());
// console.log(UTCsummer2.getTime());

let now = new Date;

console.log(now);
console.log(now.valueOf())
console.log(now.getTime())