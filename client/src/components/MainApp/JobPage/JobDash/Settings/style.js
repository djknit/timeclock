import { getInfoItemAreaStyles } from '../style';

const itemAreaStyles = getInfoItemAreaStyles(undefined, '1em', '.8em', undefined, 1.3);

export default function getStyle(additionalStyle) {
  return {
    contentArea: {
      ...additionalStyle
    },
    valueLabel: {
      fontWeight: 500
    },
    ...itemAreaStyles,
    areaLabel: {
      ...itemAreaStyles.areaHasBtnsText,
      fontSize: '1.15em',
      fontWeight: 'bold'
    }
  };
};

export { itemAreaStyles };