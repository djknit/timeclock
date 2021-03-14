import { getNumDaysSpannedBySegment } from './elemental';

function warningsGetterFactory() {
  return function getWarnings() {
    const timezone = this.props.job.time.sessionTimezone;
    let warnings = {
      hasWarning: false,
      warningMessages: []
    };
    if (this.state.hasWarning) {
      return warnings;
    }
    const numDaysSpanned = getNumDaysSpannedBySegment(this.state, timezone);
    if (numDaysSpanned > 1) {
      warnings.hasWarning = true;
      warnings.warningMessages.push(
        `This time segment spans accross ${numDaysSpanned} work days.`,
        `It will be automatically split into ${numDaysSpanned} time segments.`,
        'Are you sure you want to continue?'
      );
    }
    return warnings;
  };
}

export {
  warningsGetterFactory
};
