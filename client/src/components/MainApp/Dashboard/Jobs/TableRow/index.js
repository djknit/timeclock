import React from 'react';
import { getClickableElAttrs } from '../../../utilities';
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
      {...getClickableElAttrs(onClick, !allowTabFocus)}
    >
      {children}
    </tr>
  );
}

const TableRow = addPseudoPseudoClasses(_TableRow_needsPseudo);

export default TableRow;