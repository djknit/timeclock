import { timeInputStyles } from '../style';

export default function getStyle(labelStyle, fieldStyle) {
  return {
    mainInputGroup: {
      display: 'inline-block'
    },
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
      paddingTop: '0.5rem',
      paddingLeft: '1em'
    },
    is24hrInput: {
      marginRight: 5
    }
  };
};
