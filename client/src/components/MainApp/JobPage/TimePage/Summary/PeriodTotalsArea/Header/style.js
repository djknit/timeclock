import { contentAreaBgColor, contentAreaDividerColor } from '../style';

export default function getStyle() {

  const labelEmFontSize = 1.15;

  return {
    div: {
      position: 'relative',
      paddingTop: `${0.5 * 1.5 * labelEmFontSize}em`,
      paddingBottom: `calc(${0.5 * 1.5 * labelEmFontSize}em - 1px)`
    },
    areaLabel: {
      position: 'absolute',
      left: 0,
      top: 0,
      zIndex: 1,
      backgroundColor: contentAreaBgColor,
      paddingRight: 10,
      textAlign: 'left',
      fontSize: `${labelEmFontSize}em`,
      fontWeight: 'bold'
    },
    labelHr: {
      height: 1,
      width: '100%',
      margin: 0,
      backgroundColor: contentAreaDividerColor
    }
  };
};