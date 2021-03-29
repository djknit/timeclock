import { roundNumToNDecimalDigits } from '../../../utilities';
export * from '../../../utilities';

function formatDurationValue(
  { durationInHours },
  { decimalDigits = 3 } = {}
) {
  return `${roundNumToNDecimalDigits(durationInHours, decimalDigits)} h`;
}

function formatDataForRow({ duration, payRate, amountEarned }) {
  return {
    duration: formatDurationValue(duration),
    amountEarned: formatAmountValue(amountEarned),
    payRate: formatPayRate(payRate)
  };
}

export { formatDurationValue };

function formatAmountValue(amountVal) {
  return amountVal.display.standard;
}

function formatPayRate({ amount, isOvertime, currency }) {
  return `${formatDurationValue(amount)} /h`;
}
