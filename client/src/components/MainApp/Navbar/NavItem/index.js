import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import getStyle from './style';
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
      onClick,
      pseudoHandlers,
      pseudoState,
      style: styleProp
    } = this.props;

    let className = isDropdownLink ? 'navbar-link is-arrowless' : 'navbar-item';

    const style = getStyle(
      isActive ? { ...pseudoState, isActive } : pseudoState,
      styleProp
    );

    const commonAttrs = {
      className,
      ...pseudoHandlers,
      style: style.navItem,
      ref: this.ref,
      onClick: () => onClick({ target: this.ref.current })
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
  };
};

const NavItem = addPseudoPseudoClasses(_NavItem_needsPseudo);

export default NavItem;