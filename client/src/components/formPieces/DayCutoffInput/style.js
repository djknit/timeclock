import { timeInputStyles } from '../style';

export default function getStyle(fieldStyle, fieldLabelStyle) {

  const displayHeightAdjustment = 0;

  const displayHeight = `calc(2.5rem + ${2 * displayHeightAdjustment}px)`;

  return {
    fieldLabel: fieldLabelStyle,
    ...timeInputStyles,
    field: {
      ...timeInputStyles.field,
      ...fieldStyle
    },
    cutoffDisplay: {
      display: 'inline-block',
      fontWeight: 400,
      height: displayHeight,
      lineHeight: displayHeight,
      verticalAlign: 'top',
      fontSize: '1.2rem',
      lineHeight: 1.3,
      paddingTop: '.375rem',
      marginLeft: 5
    }
  };
};