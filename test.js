const cc = require('currency-codes');
const ccData = require('currency-codes/data');

const moment = require('moment-timezone');

const zone = moment.tz.zone('America/Chicago');

// console.log(test)

// const now = Date.now();

// console.log(now);

// const summer = new Date(2020, 9, 31);

const summer2 = new Date(2020, 10, 3);

// const testholio1 = new Date(2020, 9, 1);
// const testholio2 = new Date(2020, 9, 4);
// const testMoment = moment(testholio1)
// console.log(testMoment);
// console.log(moment(testholio2));
// console.log(testMoment.diff(moment(testholio2), 'days'));

console.log('---TEST-------------');

// const moment1 = moment(new Date(2019, 4, 25));
// const moment2 = moment(new Date(2019, 6, 25));
// console.log(moment2.diff(moment1, 'days'))
// console.log(moment2.diff(moment1, 'weeks'))
// console.log(moment1.diff(moment2, 'weeks'))

// let m1 = moment(summer2);
// let m2 = moment(summer2).add(1, 'days');

// console.log(m1.format());
// console.log(m2.format());

// let today = moment(new Date());
// console.log(today.format());

// console.log(today.day());

// today.day(6);
// console.log(today.format());

// console.log(today.day());

// console.log()


// myFunc().then(
//   result => {
//     console.log('1st then');
//     console.log(result);
//     result += ' dogs';
//     return result;
//   }
// ).then(result2 => {
//   console.log('2nd then');
//   console.log(result2);
//   return result2 + ' cats'
// }).then(result3 => {
//   console.log('3rd then');
//   console.log(result3);
// }).catch(err => {
//   console.log('catch');
//   console.log(err)
// })

// function myFunc() {
//   return new Promise(
//     (resolve, reject) => {
//       resolve('cats');
//     }
//   )
// }

console.log('---------------------');

// console.log(moment(summer2).diff(moment(summer), 'days'))

// const today = new Date(2020, 0, 8);
// const todayMoment = moment(today);

// console.log(today.year)

// console.log(todayMoment)
// console.log(todayMoment.day(2))
// console.log(todayMoment)

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