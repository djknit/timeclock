import { valueLabel } from '../style';
import { bulmaFormBlack, bulmaFormBlue } from '../../../../../AppStyle';

export default function getStyle(toggleStyles, togglerPseudoState, pStyle, detailsPaddingTop) {
  const detailsToggleSizeRatio = .7;
  const detailsTogglePaddingLeft = 10;

  const { isActive, isHovered, isFocused } = togglerPseudoState;
  const isTogglerBlack = isActive || isHovered || isFocused;

  const detailsP = {
    ...pStyle,
    paddingTop: 0,
    paddingBottom: 0
  };
  const detailsPNotLast = {
    ...detailsP,
    paddingBottom: '.2em'
  };
  const firstDetailsP = {
    ...detailsPNotLast,
    paddingTop: detailsPaddingTop || 0
  };
  const subDetailsP = {
    ...detailsP,
    paddingTop: '.15em',
    paddingLeft: '.5em'
  };

  return {
    p: pStyle,
    detailsToggler: {
      display: 'inline-block',
      position: 'relative',
      paddingLeft: detailsTogglePaddingLeft,
      fontSize: `${detailsToggleSizeRatio}em`,
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
    },
    firstDetailsP,
    detailsPNotLast,
    lastDetailsP: detailsP,
    subDetailsPNotLast: subDetailsP,
    lastSubDetailsP: {
      ...subDetailsP,
      paddingBottom: (pStyle && pStyle.paddingBottom) || 0
    }
  };
};