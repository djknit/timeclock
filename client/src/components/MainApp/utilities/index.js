import * as utilities from '../../utilities';

export * from '../../utilities';

function formatMyDate(myDate) {
  return utilities.dates.getMoment(myDate).format('MMM D, YYYY');
}

export { formatMyDate };