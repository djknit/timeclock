import dataServiceFactory from './dataServiceFactory';
import api from './api';
import dates from './dates';
import jobData from './jobData';

function capitalizeFirstLetter(string) {
  // source: https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
  return string && (string.charAt(0).toUpperCase() + string.slice(1));
}

function isWindowWide(windowWidth) {
  return windowWidth >= 769;
};

export {
  dataServiceFactory,
  api,
  dates,
  jobData,
  capitalizeFirstLetter,
  isWindowWide
};

export default {
  dataServiceFactory,
  api,
  dates,
  jobData,
  capitalizeFirstLetter,
  isWindowWide
};