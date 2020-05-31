import { shadow, sectionHeadingFontFam } from '../style';

export default function getStyle(additionalStyle) {
  return {
    section: {
      padding: 15,
      minHeight: 40,
      width: '100%',
      backgroundColor: '#f1f1f1',
      ...shadow(8),
      borderRadius: '.4%',
      ...additionalStyle
    }
  };
};

export function getTitleStyle(additionalStyle) {
  return {
    // fontFamily: sectionHeadingFontFam,
    ...additionalStyle
  };
}