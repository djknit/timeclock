import { contentAreaDividerColor, getArrowStylesForPseudoClassState } from '../style';

export default function getStyle(togglerArrowPseudoState) {

  const arrowFontSize = '1.6rem';
  const arrowXPadding = `calc(0.15 * ${arrowFontSize})`;

  return {
    div: {
      position: 'relative',
      // paddingTop: `calc(0.6 * ${arrowFontSize} - 1px)`,
      paddingBottom: `calc(0.4 * ${arrowFontSize})`
    },
    footerHr: {
      height: 1,
      backgroundColor: contentAreaDividerColor,
      width: `calc(100% - 10px - ${arrowFontSize})`,
      margin: 0
    },
    togglerArrow: {
      position: 'absolute',
      padding: `0 ${arrowXPadding}`,
      right: `calc(-1 * ${arrowXPadding})`,
      bottom: 0,
      fontSize: arrowFontSize,
      lineHeight: 1,
      ...getArrowStylesForPseudoClassState(togglerArrowPseudoState)
    }
  };
};
