import { timeInputStyles } from '../style';

export default function getStyle(labelStyle, fieldStyle) {
  return {
    hoursInput: {
      width: '3.5em',
      textAlign: 'right'
    },
    ...timeInputStyles,
    field: {
      ...timeInputStyles.field,
      ...fieldStyle
    },
    label: {
      ...timeInputStyles.label,
      ...labelStyle
    },
  };
};
