import { getInfoItemAreaStyles } from '../style';

const itemAreaStyles = getInfoItemAreaStyles(undefined, undefined, undefined, undefined, 1.3);

export default function getStyle(additionalStyle) {
  return {
    contentArea: {
      ...additionalStyle
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