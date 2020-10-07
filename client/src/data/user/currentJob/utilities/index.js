export * from '../../../utilities';

function convertDayCutoffToMinutes(rawValue = 0) {
  return Math.round(rawValue / (1000 * 60));
}

export {
  convertDayCutoffToMinutes
};