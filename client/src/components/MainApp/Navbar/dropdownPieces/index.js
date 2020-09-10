import React from 'react';
import './style.css';
import getStyle from './style';
import NavItem from '../NavItem';

function DropdownContainer({ children, isDropdownActive }) {
  const style = getStyle();
  console.log(isDropdownActive)
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
        isDropdownActive,
        onClick
      }}
    >
      {children}&nbsp;<i className={arrowClassName} style={style.dropdownArrow} />
    </NavItem>
  );
}

function Dropdown({ children }) {
  const style = getStyle();
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