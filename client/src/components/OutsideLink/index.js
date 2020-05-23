import React, { Component } from 'react';
import getStyle from './style';

class OutsideLink extends Component {
  constructor(props) {
    super(props);
    this.setActive = this.setActive.bind(this);
    this.setHovered = this.setHovered.bind(this);
    this.setFocused = this.setFocused.bind(this);
    this.state = {
      isActive: false,
      isHovered: false,
      isFocused: false
    };
  };

  setActive(isActive) {
    this.setState({ isActive });
  };

  setHovered(isHovered) {
    this.setState({ isHovered });
  };

  setFocused(isFocused) {
    this.setState({ isFocused });
  };

  render() {
    const { styles, href, children } = this.props;

    const style = getStyle(styles, this.state);

    const attributes = {
      href,
      target: '_blank',
      rel: 'noopener noreferrer',
      style,
      onMouseEnter: () => this.setHovered(true),
      onMouseLeave: () => {
        this.setHovered(false);
        this.setActive(false);
      },
      onTouchStart: () => this.setActive(true),
      onTouchEnd: () => this.setActive(false),
      onMouseDown: () => this.setActive(true),
      onMouseUp: () => this.setActive(false),
      onFocus: () => this.setFocused(true),
      onBlur: () => this.setFocused(false)
    };

    return (
      <a {...attributes}>
        {children}
      </a>
    );
  };
}

export default OutsideLink;