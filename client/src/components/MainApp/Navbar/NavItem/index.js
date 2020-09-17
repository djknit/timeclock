import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import getStyle from './style';
import './style.css';
import { keyTriggerCheckerFactory } from '../../utilities';
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
      onClick: onClickProp,
      pseudoHandlers,
      pseudoState,
      style: styleProp,
      tabIndex,
      goTo
    } = this.props;

    let className = isDropdownLink ? 'navbar-link is-arrowless' : 'navbar-item';

    const style = getStyle(
      isActive ? { ...pseudoState, isActive } : pseudoState,
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
      ref: this.ref,
      onClick,
      tabIndex
    };

    return destinationPath ? (
      <Link
        {...commonAttrs}
        to={destinationPath}
        onKeyDown={
          keyTriggerCheckerFactory(() => {
            onClick();
            goTo(destinationPath);
          })
        }
      >
        {children}
      </Link>
    ) : (
      <a
        {...commonAttrs}
        onKeyDown={keyTriggerCheckerFactory(onClick)}
      >
        {children}
      </a>
    );
  };
};

const NavItem = addPseudoPseudoClasses(_NavItem_needsPseudo);

export default NavItem;