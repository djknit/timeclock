import React from 'react';
import './style.css';
import getStyle from './style';
import NavItem from '../NavItem';

function Dropdown({
  isActive,
  isFullNavDisplayed,
  toggle,
  children,
  label,
  disabled,
  goTo
}) {

  const style = getStyle(isFullNavDisplayed, isActive);

  let containerClassName = 'navbar-item has-dropdown is-hoverable';
  if (isActive) containerClassName += ' is-active';

  const ddLinkArrowClassName = `fas fa-chevron-${isActive ? 'up' : 'down'}`;

  const childProps = {
    tabIndex: (isActive && !disabled) ? 0 : -1,
    goTo
  };

  return (
    <div className={containerClassName} style={style.dropdownContainer}>
      <NavItem
        isDropdownLink
        style={style.dropdownLink}
        onClick={toggle}
        {...{
          isActive
        }}
        tabIndex={disabled ? -1 : 0}
      >
        {label}&nbsp;<i className={ddLinkArrowClassName} style={style.ddLinkArrow} />
      </NavItem>
      <div className="navbar-dropdown" style={style.dropdown}>
        {/* source: https://stackoverflow.com/questions/32370994/how-to-pass-props-to-this-props-children */}
        {React.Children.map(
          children,
          child => (
            React.isValidElement(child) ? React.cloneElement(child, childProps) : child
          )
        )}
      </div>
    </div>
  );
}

export default Dropdown;