import {
  getInfoItemAreaStyles
} from '../style';

export default function getStyle(additionalStyle) {

  const itemAreaStyles = getInfoItemAreaStyles(undefined, '1em', undefined, undefined, 1.3);

  return {
    contentArea: {
      ...additionalStyle
    },
    ...itemAreaStyles,
    jobNameText: {
      ...itemAreaStyles.areaHasBtnsText,
      paddingTop: 0
    }
  };
};