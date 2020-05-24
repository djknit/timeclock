const cc = require('currency-codes');
const ccData = require('currency-codes/data');

const moment = require('moment-timezone');

// const zone = moment.tz.zone('America/Chicago');

console.log('_'.repeat(33) + '\n- - TEST' + ' -'.repeat(12) + '\n');

// let date = { date: 10, month: 3, year: 2020 };
// let dayMoment = moment.tz(date, 'America/Chicago');

const wageValidation = require('./server/utilities/wageValidation');

const testWage = {
  rate: -3,
  overtime: {}
}

// wageValidation.validateWage(testWage);
const e1 = { id: 1 };
const e2 = { id: 2 };
const e3 = { id: 3 };
const e4 = { id: 4 };
const e5 = { id: 5 };
const arr = [e1, e2, e3, e4, e5];
let removedEls = [];
// console.log('arr\n', arr)
// console.log('removed\n', removedEls)

// DOESN'T WORK (skips elements, as would be expected w/ for loop)
arr.forEach((e, i, a) => {
  // console.log('+ + +')
  // console.log(e)
  // console.log(i)
  if (e.id === 1 || e.id === 2 || e.id === 4) {
    removedEls.push(e);
    arr.splice(i, 1);
  }
});

let a, b;


// console.log('arr\n', arr)
// console.log('removed\n', removedEls)

console.log('* * *');

let x;

function doStuff(index, length) {
  return new Promise((resolve, reject) => {
    if (index === length) return resolve();
    console.log(x)
    x = index;
    resolve(doStuff(++index, length));
  })
}

// doStuff(0, 10);

// const allZones = moment.tz.names();

// let offsets = allZones.map(zone => moment.tz.zone(zone).utcOffset(moment(new Date())));
// console.log(offsets)
// console.log(offsets.sort((a, b) => a - b))

console.log('_'.repeat(33) + '\n');