import { isWindowWide } from '../style';

export default function(styles, windowWidth, fieldToLabelRatio = 5.8, isInline) {

  const additionalLabelStyles = (styles && styles.label) || {};
  const labelStyles = (
    (!isWindowWide(windowWidth) && isInline) ?
    { textAlign: 'left' } :
    {}
  );

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
    label: { ...labelStyles, ...additionalLabelStyles }
  };
}