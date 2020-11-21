import { contentAreaDividerColor, contentAreaBgColor } from '../style';
import './style.css';

export * from '../style';

export default function getStyle(contentToggleStyles) {

  const borderWidth = '1px';
  const borderStyle = `${borderWidth} solid ${contentAreaDividerColor}`;

  const labelLineHeight = 1;
  const labelEmFontSize = 1.15;
  const labelTopOffset = `${0.5 * labelLineHeight * labelEmFontSize}em`;
  const labelLeftPadding = 2;

  const arrowFontSize = '1.6rem';
  const arrowXPadding = `calc(0.15 * ${arrowFontSize})`;

  return {
    area: {
      border: borderStyle,
      // borderBottom: borderStyle,
      marginTop: labelTopOffset,
      position: 'relative',
      textAlign: 'left',
      marginBottom: `calc(0.4 * ${arrowFontSize})`,
      minHeight: '1rem',
      paddingTop: `calc(${labelEmFontSize}em - ${labelTopOffset} - ${borderWidth})`
    },
    areaLabel: {
      position: 'absolute',
      left: (-1 * labelLeftPadding),
      top: `calc(-1 * ${labelTopOffset})`,
      zIndex: 1,
      backgroundColor: contentAreaBgColor,
      paddingRight: 10,
      paddingLeft: labelLeftPadding,
      textAlign: 'left',
      fontSize: `${labelEmFontSize}em`,
      fontWeight: 'bold',
      lineHeight: labelLineHeight
    },
    areaBody: {
      paddingLeft: '0.5rem',
      textAlign: 'left',
      ...contentToggleStyles.container
    },
    togglerArrow: {
      ...contentToggleStyles.toggle,
      position: 'absolute',
      padding: `0 ${arrowXPadding}`,
      right: `calc(-1 * ${arrowXPadding})`,
      bottom: `calc(-0.5 * ${arrowFontSize})`,
      fontSize: arrowFontSize,
      lineHeight: 1,
      backgroundColor: contentAreaBgColor,
      borderRadius: '50%'
    }
  };
};
