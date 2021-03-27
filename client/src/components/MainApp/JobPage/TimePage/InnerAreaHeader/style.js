import { contentAreaBgColor, contentAreaDividerColor } from '../style';

export default function getStyle(
  styleProp,
  {
    backgroundColor = contentAreaBgColor,
    labelEmFontSize = 1.15,
    dividerColor = contentAreaDividerColor
  } = {}
) {

  return {
    div: {
      position: 'relative',
      paddingTop: `${0.5 * 1.5 * labelEmFontSize}em`,
      paddingBottom: `calc(${0.5 * 1.5 * labelEmFontSize}em - 1px)`,
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
