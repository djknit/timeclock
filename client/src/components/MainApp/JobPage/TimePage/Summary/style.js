import { getInfoItemAreaStyles } from '../style';

export default function getStyle(additionalStyle) {

  return {
    contentArea: {
      ...additionalStyle
    }
  };
};