import { roundNumToNDecimalDigits } from '../../utilities';

function getHoursDurationDisplay(durationInfo) {
  const numHrs = roundNumToNDecimalDigits(durationInfo.durationInHours, 2);
  return `${numHrs} hours`;
}

export { getHoursDurationDisplay };
