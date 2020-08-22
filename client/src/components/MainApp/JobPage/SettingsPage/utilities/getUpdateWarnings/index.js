import { getEntryWithDateExistsWarning } from './sameDate';
import { getEntriesInAffectedRangeWarning } from './inAffectedRange';

function getAddUpdateWarnings(startDate, schedule, settingDisplayName) {
  let warningMessages = [];
  const hasWarning = getEntryWithDateExistsWarning(
    startDate, schedule, warningMessages, settingDisplayName
  );
  return { warningMessages, hasWarning };
}

function getDateChangeUpdateWarnings(oldDate, newDate, schedule, settingDisplayName) {
  let warningMessages = [];
  const hasSameDateWarning = getEntryWithDateExistsWarning(
    newDate, schedule, warningMessages, settingDisplayName
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
      'Are you sure you want to replace the existing value?'
    )
  );
  return { hasWarning, warningMessages };
}

export {
  getAddUpdateWarnings,
  getDateChangeUpdateWarnings
};