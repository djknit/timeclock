import React from 'react';
import getStyle from './style';
import { getClickableElAttrs } from '../utilities';
import { addCollapsing, addPseudoPseudoClasses } from '../../../../../../higherOrder';
import Times from '../Times';

function _TwoTzTimes_needsCollapsingAndPseudo({
  dayDate,
  primaryTimezone,
  primaryTimezoneTimes,
  secondaryTimezone,
  secondaryTimezoneTimes,
  pseudoState: toggleArrowPseudoState,
  pseudoHandlers,
  contentToggle,
  disabled
}) {

  const style = getStyle(toggleArrowPseudoState, contentToggle.styles);
  
  return (
    <>
      <Times
        {...primaryTimezoneTimes}
        {...{ dayDate }}
        timezone={primaryTimezone}
      />
      <i
        className="fas fa-chevron-up"
        style={style.togglerArrow}
        {...pseudoHandlers}
        {...getClickableElAttrs(contentToggle.toggle, disabled)}
      />
      <span
        style={style.dropdownContainer}
        ref={contentToggle.containerRef}
      >
        <Times
          {...secondaryTimezoneTimes}
          {...{ dayDate }}
          timezone={secondaryTimezone}
        />
      </span>
    </>
  );
}

const _TwoTzTimes_needsCollapsing = addPseudoPseudoClasses(_TwoTzTimes_needsCollapsingAndPseudo);
const TwoTzTimes = addCollapsing(_TwoTzTimes_needsCollapsing, 'contentToggle', false, true);

export default TwoTzTimes;
