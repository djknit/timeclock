const cc = require('currency-codes');
const ccData = require('currency-codes/data');

const moment = require('moment-timezone');

const zone = moment.tz.zone('America/Chicago');

// console.log(test)

// const now = Date.now();

// console.log(now);

const summer = new Date(2020, 9, 31);

const summer2 = new Date(2020, 10, 3);

console.log('---TEST-------------');
// console.log(moment(summer2).diff(moment(summer), 'days'))

const today = new Date(2020, 0, 8);
const todayMoment = moment(today);

console.log(today.year)

// console.log(todayMoment)
// console.log(todayMoment.day(2))
// console.log(todayMoment.day(3))
// console.log(todayMoment.day(4))
// console.log(todayMoment.month())

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

// console.log(now);
// console.log(now.valueOf())
// console.log(now.getTime())