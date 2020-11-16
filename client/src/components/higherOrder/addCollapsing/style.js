import { constants } from './utilities';
import './style.css'; // CSS file contains all @keyframes definitions for animations used in this file

const { collapsingAnimationDurationInSecs } = constants;

const universalToggleAnimationProps = {
  animationDuration: `${collapsingAnimationDurationInSecs}s`,
  animationFillMode: 'forwards',
  WebkitAnimationFillMode: 'forwards'
};

function styleGetterFactory(containerHeight, isExpanded, isAnimationOn, isToggleIconAnimated, isMoving) {
  const _isIconAnimated = isToggleIconAnimated !== false; // (default to true when param is undefined)
  const sectionToggleAnimationProps = (
    isAnimationOn ?
    {
      animationName: isExpanded ? 'flip-down' : 'flip-up',
      ...universalToggleAnimationProps
    } :
    {}
  );

  const flippedArrowProps = (
    (!isAnimationOn && !isExpanded) ?
    {
      MozTransform: 'scale(1, -1)',
      WebkitTransform: 'scale(1, -1)',
      OTransform: 'scale(1, -1)',
      MsTransform: 'scale(1, -1)',
      transform: 'scale(1, -1)'
    } :
    {}
  );

  let togglerStyle = (
    _isIconAnimated ?
    { ...sectionToggleAnimationProps, ...flippedArrowProps } :
    {}
  );

  let openerTextStyle = (
    isAnimationOn ?
    {
      animationName: isExpanded ? 'fade-out' : 'fade-in',
      ...universalToggleAnimationProps
    } :
    {
      opacity: isExpanded ? 0 : 1
    }
  );

  let closerTextStyle = (
    isAnimationOn ?
    {
      animationName: isExpanded ? 'fade-in' : 'fade-out',
      ...universalToggleAnimationProps
    } :
    {
      opacity: isExpanded ? 1 : 0
    }
  );

  if (!isMoving) {
    togglerStyle.cursor = openerTextStyle.cursor = closerTextStyle.cursor = 'pointer';
  };


  return {
    container: getSectionContentStyle(containerHeight, isExpanded, isAnimationOn),
    toggle: togglerStyle,
    openerText: openerTextStyle,
    closerText: closerTextStyle
  };
};

function getSectionContentStyle(heightState, isExpanded, isAnimationOn) {
  let variableStyles;
  if (!isAnimationOn && !isExpanded) {
    variableStyles = heightState ?
    { display: 'none' } :
    {
      position: 'absolute',
      opacity: 0,
      zIndex: 0
    };
  }
  else if (isAnimationOn) {
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

export default styleGetterFactory;