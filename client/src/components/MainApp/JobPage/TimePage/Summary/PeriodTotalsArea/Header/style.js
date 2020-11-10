import { contentAreaBgColor, contentAreaDividerColor } from '../style';

export default function getStyle() {

  const labelEmFontSize = 1.15;

  return {
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
      marginTop: `${0.5 * 1.5 * labelEmFontSize}em`,
      marginBottom: `calc(${0.5 * 1.5 * labelEmFontSize}em - 1px)`,
      backgroundColor: contentAreaDividerColor
    }
  };
};