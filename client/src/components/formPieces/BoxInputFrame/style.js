import { isWindowWide } from '../style';

export default function(styles, windowWidth, isSubsection) {
  const getFlexStyle = flexGrow => (
    isWindowWide(windowWidth) && isSubsection ?
    { flexGrow } :
    {}
  );

  return {
    normalWeight: {
      fontWeight: 'normal'
    },
    subSectionFieldLabel: getFlexStyle(2), // make label wider than Bulma style (2:7 ratio instead of 1:5)
    subSectionFieldBody: getFlexStyle(7),
    ...styles
  };
}