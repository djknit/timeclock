import React from 'react';
import getStyle from './style';
import { getClickableElAttrs } from '../utilities';
import { addCollapsing, addPseudoPseudoClasses } from '../../../../../../higherOrder';

function _DropdownForTd_needsCollapsingAndPseudo({
  contentToggle,
  pseudoState,
  pseudoHandlers,
  children,
  disabled
}) {

  console.log('td dd contentToggle:\n ', contentToggle);

  const style = getStyle(pseudoState, contentToggle.styles);

  return (
    <>
      <i
        className="fas fa-chevron-up"
        style={style.togglerArrow}
        {...pseudoHandlers}
        {...getClickableElAttrs(contentToggle.toggle, disabled)}
      />
      <span
        style={style.dropdownContainer}
        ref={contentToggle.containerRef}
        {...{ children }}
      />
    </>
  );
}

const _DropdownForTd_needsPseudo = addCollapsing(
  _DropdownForTd_needsCollapsingAndPseudo, 'contentToggle', false, true
);
const DropdownForTd = addPseudoPseudoClasses(_DropdownForTd_needsPseudo);

export default DropdownForTd;
