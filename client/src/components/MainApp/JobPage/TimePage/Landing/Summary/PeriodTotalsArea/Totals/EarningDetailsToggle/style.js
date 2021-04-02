import {
  getArrowStylesForPseudoClassState,
  togglerArrowsEmXPadding,
  contentAreaTextLinkColors,
  valueLabelStyle
} from '../style';
import { calculateStyleForPseudoClassState } from '../../../../../../../../higherOrder';

export default function getStyle(pseudoState, toggleStyles) {

  const textStyle = getTextStyle(pseudoState);
  const areaPaddingLeft = 0;

  return {
    togglerArea: {
      position: 'relative',
      display: 'inline-block',
      paddingLeft: areaPaddingLeft,
      outline: 'none',
      fontSize: '1.2em',
      height: '1em',
      marginTop: '.2em',
      left: '-.4em'
    },
    arrow: {
      ...toggleStyles.toggle,
      padding: `0 ${togglerArrowsEmXPadding}em`,
      ...getArrowStylesForPseudoClassState(pseudoState),
      verticalAlign: 'top'
    },
    textArea: {
      position: 'relative',
      display: 'inline-block',
      height: '100%'
    },
    toggleOpenText: {
      ...toggleStyles.openerText,
      ...textStyle,
      verticalAlign: 'top'
    },
    toggleClosedText: {
      ...toggleStyles.closerText,
      position: 'absolute',
      right: 0,
      ...textStyle
    }
  };
};

function getTextStyle(pseudoState) {
  const bolderStyleFactory = () => ({ fontWeight: 700 });

  let stylesForPseudoClasses = {
    innate: {
      fontWeight: valueLabelStyle.fontWeight
    },
    hover: bolderStyleFactory(),
    active: bolderStyleFactory(),
    focus: bolderStyleFactory()
  };

  Object.keys(contentAreaTextLinkColors).forEach(pseudoClass => {
    if (!stylesForPseudoClasses[pseudoClass]) stylesForPseudoClasses[pseudoClass] = {};
    stylesForPseudoClasses[pseudoClass].color = contentAreaTextLinkColors[pseudoClass];
  });

  stylesForPseudoClasses.tabFocus = {
    ...stylesForPseudoClasses.focus,
    textDecoration: 'underline'
  };

  const textWidthToFontSizeRatio = 10.47; // measured, depends on content of text 
  const emFontSize = 0.8;
  const yPadding = ((1 / emFontSize) - 1) / 2; // for when emFontSize <= 1

  return {
    ...calculateStyleForPseudoClassState(stylesForPseudoClasses, pseudoState),
    width: `${textWidthToFontSizeRatio + 0.1}em`,
    display: 'inline-block',
    textAlign: 'center',
    lineHeight: 1,
    fontSize: `${emFontSize}em`,
    padding: `${yPadding}em 0`
  };
}