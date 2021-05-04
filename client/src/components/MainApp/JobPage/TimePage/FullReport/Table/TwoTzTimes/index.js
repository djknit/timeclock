import React from 'react';
import getStyle from './style';
import {
  getTimezoneAbbreviation, getClickableElAttrs
} from '../utilities';
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
      />
      {getTimezoneAbbreviation(primaryTimezone)}
      <i
        className="fas fa-chevron-up"
        style={style.togglerArrow}
        {...pseudoHandlers}
        {...getClickableElAttrs(contentToggle.toggle, disabled)}
      />
      <br />
      <span
        style={style.dropdownContainer}
        ref={contentToggle.containerRef}
      >
        <Times
          {...secondaryTimezoneTimes}
          {...{ dayDate }}
        />
        {getTimezoneAbbreviation(secondaryTimezone)}
      </span>
    </>
  );
}

const _TwoTzTimes_needsCollapsing = addPseudoPseudoClasses(_TwoTzTimes_needsCollapsingAndPseudo);
const TwoTzTimes = addCollapsing(_TwoTzTimes_needsCollapsing, 'contentToggle', false, true);

export default TwoTzTimes;
