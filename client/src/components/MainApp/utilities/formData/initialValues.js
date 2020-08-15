import { guessUserTimezone } from '../elemental';

function getSettingInputInitialValues() {
  return {
    timezone: guessUserTimezone() || '',
    wage: {
      useWage: false,
      rate: '',
      currency: 'USD',
      overtime: {
        useOvertime: true,
        useMultiplier: true,
        multiplier: 1.5,
        rate: '',
        cutoff: {
          hours: 40,
          minutes: 0
        }
      }
    },
    weekBegins: 0,
    dayCutoff: {
      hour: 0,
      minute: 0,
      is24hr: false
    }
  };
}

export {
  getSettingInputInitialValues
};