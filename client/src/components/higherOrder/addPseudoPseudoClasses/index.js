// ABOUT THIS FILE:
// This HOC is responsible for managing state in order to mimic basic pseudo-classes `:hover`, `:active`, and `:focus`.
// Additionally, I added a special pseudo-class state `isTabFocused` to mimic `:focus` but only if the element was focused with the keyboard.
// The HOC passes 2 props to the wrapped component:
  // 1.) `pseudoState`: an object with `isActive`, `isHovered`, `isFocused`, and `isTabFocused` states
  // 2.) `pseudoHandlers`: an object of event handlers that needs to be passed as props to the top-level element in the wrapped component.

import React, { Component } from 'react';

function addPseudoPseudoClasses(ComponentToWrap) {
  return class WrappedComponent extends Component {
    constructor(props) {
      super(props);
      this.setActive = this.setActive.bind(this);
      this.setHovered = this.setHovered.bind(this);
      this.setFocused = this.setFocused.bind(this);
      this.state = {
        isActive: false,
        isHovered: false,
        isFocused: false,
        isTabFocused: false // when focused by tabbing to el
      };
    };

    setActive(isActive) {
      this.setState({ isActive });
    };
  
    setHovered(isHovered) {
      this.setState({ isHovered });
    };
  
    setFocused(isFocused) {
      this.setState({
        isFocused,
        // if clicked instead of tabbed, onMouseDown should have set isActive = true before onFocus
        isTabFocused: isFocused && !this.state.isActive
      });
    };

    render() {

      const pseudoState = { ...this.state };

      const pseudoHandlers = {
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
        <ComponentToWrap
          {...{ pseudoState, pseudoHandlers }}
          {...this.props}
        />
      );
    };
  };
}

export default addPseudoPseudoClasses;

export { calculateStyleForPseudoClassState } from './style';