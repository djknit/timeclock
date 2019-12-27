const cc = require('currency-codes');
const ccData = require('currency-codes/data');

console.log(ccData.filter(data => data.code === 'USD'));

console.log(cc.code('USD'));
console.log(cc.code('XyZ'));
console.log(cc.code('usd'));