import React from 'react';
import './style.css';
import getStyle from './style';
import NavItem from '../NavItem';

function DropdownContainer({ children, isDropdownActive }) {
  const style = getStyle();
  let className = 'navbar-item has-dropdown is-hoverable';
  if (isDropdownActive) className += ' is-active';
  return (
    <div {...{ className }} style={style.dropdownContainer}>
      {children}
    </div>
  );
}

function DropdownLink({
  children,
  style: styleProp,
  isDropdownActive,
  onClick
}) {
  const arrowClassName = `fas fa-chevron-${isDropdownActive ? 'up' : 'down'}`;
  const style = getStyle();
  return (
    <NavItem
      isDropdownLink
      style={{ ...style.dropdownLink, ...styleProp }}
      {...{
        onClick
      }}
      isActive={isDropdownActive}
    >
      {children}&nbsp;<i className={arrowClassName} style={style.dropdownArrow} />
    </NavItem>
  );
}

function Dropdown({ children, isFullNavDisplayed }) {
  const style = getStyle(isFullNavDisplayed);
  return (
    <div className="navbar-dropdown" style={style.dropdown}>
      {children}
    </div>
  );
}

export {
  DropdownLink,
  DropdownContainer,
  Dropdown
};