import React from 'react';
import { Link } from 'react-router-dom';
import getStyle from './style';
import { addPseudoPseudoClasses } from '../../../higherOrder';

function _NavItem_needsPseudo({
  children,
  isActive,
  isDropdownLink,
  destinationPath,
  onClick,
  pseudoHandlers,
  pseudoState,
  style: styleProp
}) {

  let className = isDropdownLink ? 'navbar-link is-arrowless' : 'navbar-item';
  if (isActive) className += ' is-active';

  const style = getStyle(pseudoState, styleProp);

  const commonAttrs = {
    className,
    ...pseudoHandlers,
    style: style.navItem,
    onClick
  };

  return destinationPath ? (
    <Link {...commonAttrs} to={destinationPath}>
      {children}
    </Link>
  ) : (
    <a {...commonAttrs}>
      {children}
    </a>
  );
}

const NavItem = addPseudoPseudoClasses(_NavItem_needsPseudo);

export default NavItem;