import { shadow, sectionHeadingFontFam, contentAreaPadding } from '../style';

export default function getStyle(additionalStyle) {
  return {
    section: {
      padding: contentAreaPadding,
      minHeight: 40,
      width: '100%',
      backgroundColor: '#f1f1f1',
      ...shadow(8),
      borderRadius: '.4%',
      ...additionalStyle
    }
  };
};

function getTitleStyle(additionalStyle) {
  return {
    // fontFamily: sectionHeadingFontFam,
    ...additionalStyle
  };
}

export {
  getTitleStyle
};