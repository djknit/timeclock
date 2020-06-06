import './style.css'; // CSS file contains all @keyframes definitions for animations used in this file
import { bulmaFormBlack, bulmaFormBlue } from '../style';

const universalToggleAnimationProps = {
  animationDuration: '2s',
  animationFillMode: 'forwards',
  WebkitAnimationFillMode: 'forwards'
};

export default function getStyle(sectionContentHeight, isExpanded, arrowTogglePseudoState, isWageContentAnimationOn) {
  
  const toggleBtnFontSize = '1.6rem';
  const { isActive, isHovered, isFocused } = arrowTogglePseudoState;
  const isToggleBlack = isActive || isHovered || isFocused;
  
  const sectionToggleAnimationProps = (
    isWageContentAnimationOn ?
    {
      animationName: isExpanded ? 'flip-down' : 'flip-up',
      ...universalToggleAnimationProps
    } :
    {}
  );

  const flippedArrowProps = (
    (!isWageContentAnimationOn && !isExpanded) ?
    {
      MozTransform: 'scale(1, -1)',
      WebkitTransform: 'scale(1, -1)',
      OTransform: 'scale(1, -1)',
      MsTransform: 'scale(1, -1)',
      transform: 'scale(1, -1)'
    } :
    {}
  );

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
    useWageInputField: {
      marginBottom: 0
    },
    sectionContent: getSectionContentStyle(sectionContentHeight, isExpanded, isWageContentAnimationOn),
    firstInputInSection: {
      marginTop: '.75rem' // matches Bulma field bottom margin
    },
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
      cursor: 'pointer',
      ...sectionToggleAnimationProps,
      ...flippedArrowProps
    }
  };
};

function getSectionContentStyle(heightState, isExpanded, isWageContentAnimationOn) {
  let variableStyles;
  if (!isWageContentAnimationOn && !isExpanded) {
    variableStyles = {
      position: 'absolute',
      opacity: 0
    };
  }
  else if (isWageContentAnimationOn) {
    variableStyles = {
      animationName: isExpanded ? 'open' : 'close',
      ...universalToggleAnimationProps
    };
  }
  else variableStyles = {};
  return {
    height: heightState || 'auto',
    overflow: 'hidden',
    ...variableStyles
  };
}