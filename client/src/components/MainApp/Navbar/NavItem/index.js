import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import getStyle from './style';
import './style.css';
import { getClickableElAttrs } from '../../utilities';
import { addPseudoPseudoClasses } from '../../../higherOrder';

class _NavItem_needsPseudo extends Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  };

  render() {
    const {
      children,
      isActive,
      isDropdownLink,
      destinationPath,
      currentPath,
      onClick: onClickProp,
      pseudoHandlers,
      pseudoState,
      style: styleProp,
      goTo,
      disabled
    } = this.props;

    let className = isDropdownLink ? 'navbar-link is-arrowless' : 'navbar-item';

    const style = getStyle(
      isActive ? { ...pseudoState, isActive } : pseudoState,
      (destinationPath && currentPath === destinationPath),
      styleProp
    );

    const onClick = () => {
      onClickProp({ target: this.ref.current });
      if (this.ref.current) this.ref.current.blur();
    };

    const commonAttrs = {
      className,
      ...pseudoHandlers,
      style: style.navItem,
      ref: this.ref
    };

    return destinationPath ? (
      <Link
        {...commonAttrs}
        to={destinationPath}
        {...getClickableElAttrs(
          (() => {
            onClick();
            goTo(destinationPath);
          }),
          disabled
        )}
      >
        {children}
      </Link>
    ) : (
      <a
        {...commonAttrs}
        {...getClickableElAttrs(onClick, disabled)}
      >
        {children}
      </a>
    );
  };
};

const NavItem = addPseudoPseudoClasses(_NavItem_needsPseudo);

export default NavItem;