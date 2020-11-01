import sharedResources from '../shared';

let dateUtils = sharedResources.utilities.dates;

const { getMoment, convertMomentToMyDate } = dateUtils;

function getNextDate(myDate) {
  return convertMomentToMyDate(getMoment(myDate).add(1, 'days'));
}

// function getPrecedingDate(myDate) {
//   return convertMomentToMyDate(getMoment(myDate).subtract(1, 'days'));
// }


export const dates = { 
  ...dateUtils,
  getNextDate,
  // getPrecedingDate
};