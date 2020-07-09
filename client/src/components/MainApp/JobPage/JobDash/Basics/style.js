import {
  getInfoItemAreaStyles
} from '../style';

export default function getStyle(additionalStyle) {

  const itemAreaStyles = getInfoItemAreaStyles(undefined, undefined, undefined, undefined, 1.3);

  return {
    contentArea: {
      ...additionalStyle
    },
    ...itemAreaStyles
  };
};