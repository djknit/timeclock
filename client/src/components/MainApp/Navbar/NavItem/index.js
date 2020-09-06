import React from 'react';
import getStyle from './style';
import { addPseudoPseudoClasses } from '../../../higherOrder';

function _NavItem_needsPseudo({
  children,
  isActive,
  hasDropdown,
  pseudoHandlers,
  pseudoState
}) {

  let className = 'navbar-item';
  if (isActive) className += ' is-active';
  if (hasDropdown) className += ' has-dropdown is-hoverable';

  const style = getStyle(pseudoState);

  function TopLevelEl({ children: _children, ..._props }) {
    return hasDropdown ? (
      <div {..._props}>{_children}</div>
    ) : (
      <a {..._props}>{_children}</a>
    );
  }

  return (
    <TopLevelEl
      {...{ className }}
      {...pseudoHandlers}
      style={style.navItem}
    >
      {children}
    </TopLevelEl>
  );
}

const NavItem = addPseudoPseudoClasses(_NavItem_needsPseudo);

export default NavItem;