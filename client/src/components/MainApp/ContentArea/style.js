import { shadow, sectionHeadingFontFam, contentAreaPadding } from '../style';

const contentAreaBgColor = '#f1f1f1';

export default function getStyle(additionalStyle) {
  return {
    section: {
      padding: contentAreaPadding,
      minHeight: 40,
      backgroundColor: contentAreaBgColor,
      ...shadow(8),
      borderRadius: '.4%',
      ...additionalStyle
    }
  };
};

function getTitleStyle(additionalStyle) {
  return {
    textAlign: 'center',
    ...additionalStyle
  };
}

export {
  getTitleStyle,
  contentAreaBgColor
};