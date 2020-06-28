import React from 'react';
import { addPseudoPseudoClasses, calculateStyleForPseudoClassState } from '../../../../higherOrder';

function _TableRow_needsPseudo({
  pseudoState,
  pseudoHandlers,
  children,
  styles,
  onClick,
  allowTabFocus
}) {

  const style = calculateStyleForPseudoClassState(styles, pseudoState);

  return (
    <tr
      style={style}
      {...pseudoHandlers}
      {...{ onClick }}
      tabIndex={allowTabFocus ? 0 : -1}
    >
      {children}
    </tr>
  );
}

const TableRow = addPseudoPseudoClasses(_TableRow_needsPseudo);

export default TableRow;