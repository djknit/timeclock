import { isWindowWide } from '../style';

export default function(styles, windowWidth, fieldToLabelRatio) {

  return {
    normalWeight: {
      fontWeight: 'normal'
    },
    subSectionFieldBody: (
      isWindowWide(windowWidth) ?
      { flexGrow: fieldToLabelRatio || 5 } :
      {}
    ),
    ...styles
  };
}