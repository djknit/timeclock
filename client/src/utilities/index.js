import api from './api';
export * from './jobData';
export * from './dates';
export * from './data';

function capitalizeFirstLetter(string) {
  // source: https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
  return string && (string.charAt(0).toUpperCase() + string.slice(1));
}

function isWindowWide(windowWidth) {
  return windowWidth >= 769;
};

export {
  api,
  capitalizeFirstLetter,
  isWindowWide
};