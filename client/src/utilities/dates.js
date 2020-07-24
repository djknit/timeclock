import sharedResources from '../shared';
console.log(sharedResources)
const sharedDateUtils = sharedResources.utilities.dates;

export default {
  ...sharedDateUtils
};