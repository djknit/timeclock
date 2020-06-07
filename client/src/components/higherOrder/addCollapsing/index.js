// ABOUT THIS FILE:
// This HOC is responsible for managing state for a collapsing containter and toggle button.
// One prop is passed to wrapped component whose name is given as a parameter to the HOC function.
  // The passed prop is an object with props:
  // `containerRef`, `setHeight`, `clearHeight`, `toggle`, `styles`, and `setIsExpanded`

import React, { Component } from 'react';
import getStyle from './style';

function addCollapsing(ComponentToWrap, propName, isExpandedInitially, isToggleIconAnimated) {
  const initialState = {
    containerHeight: undefined,
    isExpanded: isExpandedInitially || false,
    isAnimationOn: false
  };

  return class extends Component {
    constructor(props) {
      super(props);
      this.setHeight = this.setHeight.bind(this);
      this.clearHeight = this.clearHeight.bind(this);
      this.toggle = this.toggle.bind(this);
      this.setIsExpanded = this.setIsExpanded.bind(this);
      this.reset = this.reset.bind(this);
      this.containerRef = React.createRef();
      this.state = { ...initialState };
    };

    setHeight() {
      if (!this.state.containerHeight) {
        this.setState({
          containerHeight: this.containerRef.current.scrollHeight
        });
      }
      else { // if height already set, clear and then set
        this.state(
          {
            containerHeight: undefined,
            isAnimationOn: false
          },
          () => this.setState({
            containerHeight: this.containerRef.current.scrollHeight
          })
        )
      }
    };

    clearHeight() {
      this.setState({
        containerHeight: undefined,
        isAnimationOn: false
      });
    }

    toggle() {
      this.setState({
        isExpanded: !this.state.isExpanded,
        isAnimationOn: true
      });
    };

    setIsExpanded(newIsExpandedValue) {
      let stateUpdates = { isExpanded: newIsExpandedValue };
      if (!!newIsExpandedValue !== !!this.state.isExpanded) {
        stateUpdates.isAnimationOn = true;
      }
      this.setState(stateUpdates);
    }

    reset() {
      this.setState({ ...initialState });
    };

    render() {

      const { containerRef, state, props, setHeight, clearHeight, toggle, setIsExpanded } = this;

      const { containerHeight, isExpanded, isAnimationOn } = state;

      const styles = getStyle(containerHeight, isExpanded, isAnimationOn, isToggleIconAnimated);

      const propsToPass = {
        ...props,
        [propName]: {
          containerRef,
          setHeight,
          clearHeight,
          toggle,
          styles,
          setIsExpanded
        }
      };

      return (
        <ComponentToWrap {...propsToPass} />
      );
    };
  };
}

export default addCollapsing;