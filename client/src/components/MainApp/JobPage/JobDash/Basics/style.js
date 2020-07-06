import {
  contentAreaDividerColor
} from '../style';

export default function getStyle(additionalStyle) {
  return {
    contentArea: {
      ...additionalStyle
    },
    hr: {
      color: contentAreaDividerColor
    }
  };
};