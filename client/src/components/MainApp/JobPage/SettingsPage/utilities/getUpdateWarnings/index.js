import { dates as dateUtils } from '../../../utilities';
import { getEntryWithDateExistsWarning } from './sameDate';
import { getEntriesInAffectedRangeWarning } from './inAffectedRange';

const { areDatesEquivalent } = dateUtils;

const messagePart2ForSameDateOnly = 'Are you sure you want to replace the existing value?';

function getAddUpdateWarnings(startDate, schedule, settingDisplayName) {
  let warningMessages = [];
  const hasWarning = getEntryWithDateExistsWarning(
    startDate, schedule, warningMessages, settingDisplayName
  );
  if (warningMessages.length > 0) {
    warningMessages.push(messagePart2ForSameDateOnly);
  }
  return { warningMessages, hasWarning };
}

function getDateChangeUpdateWarnings(oldDate, newDate, schedule, settingDisplayName) {
  let warningMessages = [];
  const hasSameDateWarning = (
    !areDatesEquivalent(oldDate, newDate) &&
    getEntryWithDateExistsWarning(newDate, schedule, warningMessages, settingDisplayName)
  );
  const hasEntryInRangeWarning = getEntriesInAffectedRangeWarning(
    oldDate, newDate, schedule, warningMessages, settingDisplayName
  );
  const hasWarning = hasSameDateWarning || hasEntryInRangeWarning;
  if (!hasWarning) {
    return { warningMessages, hasWarning };
  }
  warningMessages.push(
    hasEntryInRangeWarning ? (
      'Are you sure you want to continue?'
    ) : (
      messagePart2ForSameDateOnly
    )
  );
  return { hasWarning, warningMessages };
}

export {
  getAddUpdateWarnings,
  getDateChangeUpdateWarnings
};