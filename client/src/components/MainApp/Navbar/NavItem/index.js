import React from 'react';
import getStyle from './style';
import { addPseudoPseudoClasses } from '../../../higherOrder';

function _NavItem_needsPseudo({
  children,
  isActive,
  isDropdownLink,
  pseudoHandlers,
  pseudoState,
  style: styleProp
}) {

  let className = isDropdownLink ? 'navbar-link is-arrowless' : 'navbar-item';
  if (isActive) className += ' is-active';

  const style = getStyle(pseudoState, styleProp);

  return (
    <a
      {...{ className }}
      {...pseudoHandlers}
      style={style.navItem}
    >
      {children}
      {isDropdownLink && (
        <>&nbsp;<i className="fas fa-chevron-down" style={style.dropdownArrow} /></>
      )}
    </a>
  );
}

const NavItem = addPseudoPseudoClasses(_NavItem_needsPseudo);

export default NavItem;