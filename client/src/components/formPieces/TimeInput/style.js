import { timeInputStyles } from '../style';

export default function getStyle(labelStyle, fieldStyle) {
  return {
    hoursInput: {
      width: '3.5em',
      textAlign: 'right'
    },
    field: {
      ...fieldStyle
    },
    label: {
      ...labelStyle
    },
    ...timeInputStyles,
    is24hrInputGroup: {
      display: 'inline-block',
      position: 'absolute',
      right: 0,
      paddingTop: '0.375rem' // copied from `DayCutoffInput`; not sure where num comes from.
    },
    is24hrInput: {
      marginRight: 5
    }
  };
};
