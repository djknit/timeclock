import { contentAreaBgColor, contentAreaDividerColor } from '../style';

const defaultLabelEmFontSize = 1.15;
const lineHeight = 1.5;

export default function getStyle(
  styleProp,
  {
    backgroundColor = contentAreaBgColor,
    labelEmFontSize = defaultLabelEmFontSize,
    dividerColor = contentAreaDividerColor
  } = {}
) {

  const emTextHeight = getLabelTextEmHeight(labelEmFontSize);

  return {
    div: {
      position: 'relative',
      paddingTop: `${0.5 * emTextHeight}em`,
      paddingBottom: `calc(${0.5 * emTextHeight}em - 1px)`,
      ...styleProp
    },
    text: {
      position: 'absolute',
      left: 0,
      top: 0,
      zIndex: 1,
      backgroundColor: backgroundColor,
      paddingRight: 10,
      textAlign: 'left',
      fontSize: `${labelEmFontSize}em`,
      fontWeight: 'bold'
    },
    hr: {
      height: 1,
      width: '100%',
      margin: 0,
      backgroundColor: dividerColor
    }
  };
};

function getLabelTextEmHeight(emFontSize = defaultLabelEmFontSize) {
  return lineHeight * emFontSize;
}

export { getLabelTextEmHeight };
