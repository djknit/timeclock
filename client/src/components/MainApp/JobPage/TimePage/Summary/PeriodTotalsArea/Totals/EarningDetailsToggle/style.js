import {
  getArrowStylesForPseudoClassState, togglerArrowsEmXPadding, contentAreaTextLinkColors
} from '../../style';
import { calculateStyleForPseudoClassState } from '../../../../../../../higherOrder';

export default function getStyle(pseudoState, toggleStyles) {

  let textStyle = getTextStyle(pseudoState);
  const areaPaddingLeft = 10;

  return {
    togglerArea: {
      display: 'inline-block',
      paddingLeft: areaPaddingLeft,
      outline: 'none',
      fontSize: '1em',
      height: '1em',
      marginTop: '.2em'
    },
    arrow: {
      ...toggleStyles.toggle,
      padding: `0 ${togglerArrowsEmXPadding}em`,
      ...getArrowStylesForPseudoClassState(pseudoState),
      fontSize: '1em',
      verticalAlign: 'top'
    },
    textArea: {
      height: '100%',
      position: 'relative',
      display: 'inline-block'
    },
    toggleOpenText: {
      ...toggleStyles.openerText,
      ...textStyle,
      verticalAlign: 'top'
    },
    toggleClosedText: {
      ...toggleStyles.closerText,
      position: 'absolute',
      left: 0,
      ...textStyle
    }
  };
};

function getTextStyle(pseudoState) {
  const bolderStyleFactory = () => ({ fontWeight: 600 });

  console.log(contentAreaTextLinkColors)

  let stylesForPseudoClasses = {
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

  const textWidthToFontSizeRatio = 9.99; // measured, depends on content of text 

  const emFontSize = 0.7;
  const yPadding = ((1 / emFontSize) - 1) / 2;

  return {
    ...calculateStyleForPseudoClassState(stylesForPseudoClasses, pseudoState),
    width: `${textWidthToFontSizeRatio + .15}em`,
    display: 'inline-block',
    textAlign: 'center',
    lineHeight: '1',
    fontSize: '0.7em',
    padding: `${yPadding}em 0`
  };
}