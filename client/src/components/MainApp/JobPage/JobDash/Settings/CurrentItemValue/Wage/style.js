import { valueLabel, itemAreaStyles } from '../style';
import { bulmaFormBlack, bulmaFormBlue } from '../../../../../../../AppStyle';

export default function getStyle(toggleStyles, togglerPseudoState) {
  // const baseFontSize = itemAreaStyles.areaNotLastHasBtns.fontSize;
  const detailsToggleSizeRatio = .7;
  const detailsTogglePaddingLeft = 10;

  const { isActive, isHovered, isFocused } = togglerPseudoState;
  const isTogglerBlack = isActive || isHovered || isFocused;

  const detailsP = {
    ...itemAreaStyles.areaHasBtnsText,
    paddingBottom: 0
  };

  return {
    p: itemAreaStyles.areaHasBtnsText,
    detailsToggler: {
      display: 'inline-block',
      position: 'relative',
      paddingLeft: detailsTogglePaddingLeft,
      // fontSize: `calc(${detailsToggleSizeRatio} * ${baseFontSize})`,
      fontSize: `${detailsToggleSizeRatio}em`,
      // paddingTop: `calc(${1 - detailsToggleSizeRatio} * ${baseFontSize})`,
      paddingTop: `${1 - detailsToggleSizeRatio}em`,
      color: isTogglerBlack ? bulmaFormBlack : bulmaFormBlue,
      cursor: 'pointer',
      outline: 'none',
      bottom: '-.25em'
    },
    togglerArrow: {
      ...toggleStyles.toggle
    },
    toggleOpenText: {
      ...toggleStyles.openerText
    },
    toggleClosedText: {
      ...toggleStyles.closerText,
      position: 'absolute',
      left: detailsTogglePaddingLeft
    },
    valueLabel: { ...valueLabel },
    detailsArea: {
      ...toggleStyles.container,
      textAlign: 'left',
      paddingLeft: '1em',
      marginBottom: itemAreaStyles.areaHasBtnsText.paddingBottom
    },
    firstDetailsP: {
      ...detailsP,
      paddingTop: 0,
    },
    detailsPNotFirst: {
      ...detailsP,
      paddingTop: '.2em'
    }
  };
};