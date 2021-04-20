import './style.css'; // CSS file contains all @keyframes definitions for animations used in this file

const flippedArrowProps = {
  MozTransform: 'scale(1, -1)',
  WebkitTransform: 'scale(1, -1)',
  OTransform: 'scale(1, -1)',
  MsTransform: 'scale(1, -1)',
  transform: 'scale(1, -1)'
};

export default function getStyle(
  containerHeight, isExpanded, isAnimationOn, isToggleIconAnimated = true, isMoving, animationDurInSecs
) {

  const getCommonAnimationProps = animationNames => ({
    animationName: animationNames[isExpanded ? 0 : 1],
    animationDuration: `${animationDurInSecs}s`,
    animationFillMode: 'forwards',
    WebkitAnimationFillMode: 'forwards'
  });
  const getAnimatedElStyle = (animationNames, styleForAnimateOff) => (
    isAnimationOn ? getCommonAnimationProps(animationNames) : styleForAnimateOff
  );
  const ctrlElCommonStyle = !isMoving && { cursor: 'pointer' };

  return {
    container: {
      ...getAnimatedElStyle(
        ['open', 'close'],
        {
          height: containerHeight || 'auto',
          overflow: 'hidden',
          ...(
            !isExpanded && (
              containerHeight ? ({
                display: 'none'
              }) : ({
                position: 'absolute',
                opacity: 0,
                zIndex: 0
              })
            )
          )
        }
      ),
      height: containerHeight || 'auto',
      overflow: 'hidden'
    },
    openerText: {
      ...getAnimatedElStyle(
        ['fade-out', 'fade-in'],
        { opacity: isExpanded ? 0 : 1 }
      ),
      ...ctrlElCommonStyle
    },
    closerText: {
      ...getAnimatedElStyle(
        ['fade-in', 'fade-out'],
        { opacity: isExpanded ? 1 : 0 }
      ),
      ...ctrlElCommonStyle
    },
    toggle: {
      ...(
        isToggleIconAnimated &&
        getAnimatedElStyle(
          ['flip-down', 'flip-up'],
          { ...(!isExpanded && flippedArrowProps) }
        )
      ),
      ...ctrlElCommonStyle
    },
    containerParent: {  // can't be used in some places w/ current structure. needs manually set in parent components in those cases
      ...(!containerHeight && { position: 'relative' })
    }
  };
};
