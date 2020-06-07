import './style.css'; // CSS file contains all @keyframes definitions for animations used in this file

const universalToggleAnimationProps = {
  animationDuration: '2s',
  animationFillMode: 'forwards',
  WebkitAnimationFillMode: 'forwards'
};

export default function styleGetterFactory(containerHeight, isExpanded, isAnimationOn, isToggleIconAnimated) {
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

  const arrowFlipAndAnimateProps = (
    _isIconAnimated ?
    { ...sectionToggleAnimationProps, ...flippedArrowProps } :
    {}
  );

  return {
    container: getSectionContentStyle(containerHeight, isExpanded, isAnimationOn),
    toggle: {
      cursor: 'pointer',
      ...arrowFlipAndAnimateProps
    }
  };
};

function getSectionContentStyle(heightState, isExpanded, isAnimationOn) {
  let variableStyles;
  if (!isAnimationOn && !isExpanded) {
    variableStyles = {
      position: 'absolute',
      opacity: 0
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