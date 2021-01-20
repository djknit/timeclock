import { calculateStyleForPseudoClassState } from '../../../../../higherOrder';
import { contentAreaTextLinkColors } from '../style';

export default function getStyle(sectionToggleStyles, togglerPseudoState) {
  console.log(togglerPseudoState)
  
  const pseudoStateStyles = getPseudoStateStyles();
  console.log(pseudoStateStyles)
  
  const _calcTogPseudoStateStyle = _styles => {
    return calculateStyleForPseudoClassState(_styles, togglerPseudoState);
  };

  const textStyles = {
    height: '1em',
    textAlign: 'inherit',
    lineHeight: 1,
    textDecoration: 'inherit'
  };

  return {
    container: {
      ...sectionToggleStyles.container
    },
    togglerDiv: {
      display: 'inline-block',
      outline: 'none',
      ..._calcTogPseudoStateStyle(pseudoStateStyles.togglerDiv),
      lineHeight: 1
    },
    togglerP: {
      display: 'inline-block',
      position: 'relative',
      lineHeight: 1,
      margin: 0,
      width: '8.3em', // measured bold txt manually to ~8.125
      textDecoration: 'none',
      textAlign: 'center',
      ..._calcTogPseudoStateStyle(pseudoStateStyles.togglerP)
    },
    toggleOpenText: {
      ...sectionToggleStyles.openerText,
      ...textStyles,
      display: 'inline'
    },
    toggleClosedText: {
      ...sectionToggleStyles.closerText,
      ...textStyles,
      position: 'absolute',
      display: 'inline-block',
      textAlign: 'inherit',
      left: 0,
      top: 0,
      width: '100%'
    },
    togglerArrow: {
      ..._calcTogPseudoStateStyle(pseudoStateStyles.togglerArrow),
      ...sectionToggleStyles.toggle,
      height: '100%',
      fontSize: '100%',
      padding: '0 0.0625em',
      marginLeft: '0.1em'
    },
    sectionTitle: {
      textAlign: 'center'
    }
  };
};

function getPseudoStateStyles() {
  let pseudoStateStyles = { togglerDiv: {}, togglerP: {}, togglerArrow: {} };

  Object.keys(contentAreaTextLinkColors).forEach(pseudoStateName => {
    pseudoStateStyles.togglerDiv[pseudoStateName] = {
      color: contentAreaTextLinkColors[pseudoStateName]
    };
  });

  function _addPseudoStyle(_elName, _style, _pseudoClasses) {
    const _elStyles = pseudoStateStyles[_elName];
    _pseudoClasses.forEach(_pseudoClass => {
      _elStyles[_pseudoClass] = { ..._elStyles[_pseudoClass], ..._style };
    });
  }

  const _fWeight = _wt => ({ fontWeight: _wt });

  const _addTogTxtStyle = (...args) => _addPseudoStyle('togglerP', ...args);
  _addTogTxtStyle(_fWeight(700), ['hover', 'focus']);
  _addTogTxtStyle(_fWeight(600), ['active']);
  _addTogTxtStyle(_fWeight(500), ['innate']);
  _addTogTxtStyle({ textDecoration: 'underline' }, ['tabFocus']);

  _addPseudoStyle('togglerArrow', _fWeight(900), ['innate', 'active']);
  _addPseudoStyle('togglerArrow', _fWeight(1000), ['hover', 'focus']);
  _addPseudoStyle(
    'togglerArrow', { outline: `solid 1.5px ${contentAreaTextLinkColors.focus}` }, ['tabFocus']
  );

  return pseudoStateStyles;
}
