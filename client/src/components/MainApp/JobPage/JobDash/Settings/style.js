import { getInfoItemAreaStyles } from '../style';

const itemAreaStyles = getInfoItemAreaStyles(undefined, '1em', '.8em', undefined, 1.3);

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
    },
    settingValueArea: {
      position: 'relative' // needed for wage dropdown sizing on narrower screens
    }
  };
};

export { itemAreaStyles };