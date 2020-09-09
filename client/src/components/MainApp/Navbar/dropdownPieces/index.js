import React from 'react';
import './style.css';
import getStyle from './style';
import NavItem from '../NavItem';

function DropdownContainer({ children }) {
  const style = getStyle();
  return (
    <div className="navbar-item has-dropdown is-hoverable" style={style.dropdownContainer}>
      {children}
    </div>
  );
}

function DropdownLink({
  children,
  style: styleProp
}) {
  const style = getStyle();
  return (
    <NavItem isDropdownLink style={{ ...style.dropdownLink, ...styleProp }}>
      {children}
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