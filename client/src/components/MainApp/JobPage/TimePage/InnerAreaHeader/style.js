import { contentAreaBgColor, contentAreaDividerColor } from '../style';

const defaultLabelEmFontSize = 1.15;
const defaultLineHeight = 1.5;

export default function getStyle(
  styleProp,
  {
    backgroundColor = contentAreaBgColor,
    labelEmFontSize = defaultLabelEmFontSize,
    labelFontWeight = 'bold',
    dividerColor = contentAreaDividerColor,
    dividerHeight = '1px',
    lineHeight = defaultLineHeight
  } = {}
) {

  const emTextHeight = getLabelTextEmHeight(labelEmFontSize, lineHeight);
  const yPadding = `calc(${emTextHeight / 2}em - (${dividerHeight} / 2))`;

  return {
    div: {
      position: 'relative',
      paddingTop: yPadding,
      paddingBottom: yPadding,
      lineHeight,
      ...styleProp,
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
      fontWeight: labelFontWeight,
      lineHeight
    },
    hr: {
      height: dividerHeight,
      width: '100%',
      margin: 0,
      backgroundColor: dividerColor
    }
  };
};

export { getLabelTextEmHeight };


function getLabelTextEmHeight(
  emFontSize = defaultLabelEmFontSize,
  lineHeight = defaultLineHeight
) {
  return lineHeight * emFontSize;
}
