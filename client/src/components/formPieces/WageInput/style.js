import './style.css'; // CSS file contains all @keyframes definitions for animations used in this file
import { bulmaFormBlack, bulmaFormBlue } from '../style';

export default function getStyle(sectionContentHeight, isExpanded, arrowTogglePseudoState) {
  
  const toggleBtnFontSize = '1.6rem';
  const { isActive, isHovered, isFocused } = arrowTogglePseudoState;
  const isToggleBlack = isActive || isHovered || isFocused;
  
  return {
    sectionLabel: {
      position: 'relative'
    },
    sectionLabelText: { // consider: match width and alignment to Bulma horizontal field-label
      position: 'absolute',
      left: 0,
      top: 0,
      backgroundColor: '#ffffff',
      zIndex: 2,
      paddingRight: 10
    },
    sectionLabelHr: {
      position: 'absolute',
      width: '100%',
      margin: 0,
      top: 12
    },
    sectionContent: getSectionContentStyle(sectionContentHeight, isExpanded),
    sectionFooter: {
      position: 'relative'
    },
    footerHr: {
      marginTop: 12,
      marginBottom: 0,
      width: `calc(100% - 10px - ${toggleBtnFontSize})`
    },
    sectionToggle: {
      position: 'absolute',
      right: 0,
      fontSize: toggleBtnFontSize,
      bottom: `calc(-.5em + 1px)`,
      color: isToggleBlack ? bulmaFormBlack : bulmaFormBlue,
      cursor: 'pointer'
    }
  };
};

function getSectionContentStyle(heightState, isExpanded) {
  let result;
  if (!heightState) {
    result = (
      isExpanded ?
      {} :
      {
        position: 'absolute',
        opacity: 0
      }
    );
  }
  else {
    result = {
      animationName: isExpanded ? 'open' : 'close',
      animationDuration: '2s',
      animationFillMode: 'forwards',
      WebkitAnimationFillMode: 'forwards'
    };
  }
  result.height = heightState || 'auto';
  return result;
}