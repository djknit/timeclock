import { constants as importedConstants } from '../../utilities';
export * from '../../utilities';
export * from './displayData';

const constants = {
  ...importedConstants,
  datePickerPopperHeight: '289px' // <- for 5 wks. month; '256.8px' for 4 wks. month
};

export { constants };
