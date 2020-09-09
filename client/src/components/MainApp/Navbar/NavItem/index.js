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

  const content = (
    <>
      {children}
      {isDropdownLink && (
        <>&nbsp;<i className="fas fa-chevron-down" style={style.dropdownArrow} /></>
      )}
    </>
  );

  return destinationPath ? (
    <Link {...commonAttrs} to={destinationPath}>
      {content}
    </Link>
  ) : (
    <a {...commonAttrs}>
      {content}
    </a>
  );
}

const NavItem = addPseudoPseudoClasses(_NavItem_needsPseudo);

export default NavItem;