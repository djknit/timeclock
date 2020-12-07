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
    ...timeInputStyles
  };
};
