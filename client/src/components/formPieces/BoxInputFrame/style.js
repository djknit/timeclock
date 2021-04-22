import { isWindowWide } from '../style';

export default function(styles, windowWidth, fieldToLabelRatio = 5.8, isInline) {

  const labelStyles = (
    (!isWindowWide(windowWidth) && isInline) ?
    { textAlign: 'left' } :
    {}
  );
  const additionalLabelStyles = styles && styles.label;

  return {
    normalWeight: {
      fontWeight: 'normal'
    },
    subSectionFieldBody: (
      isWindowWide(windowWidth) ?
      { flexGrow: fieldToLabelRatio || 5 } :
      {}
    ),
    ...styles,
    label: { ...labelStyles, ...additionalLabelStyles },
    helpText: {
      textAlign: 'left'
    }
  };
};
