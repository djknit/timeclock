// ABOUT THIS FILE:
// This HOC is responsible for managing state for a collapsing containter and toggle button.
// One prop is passed to wrapped component whose name is given as a parameter to the HOC function.
  // The passed prop is an object with props:
  // `containerRef`, `setHeight`, `clearHeight`, `toggle`, `styles`,`setIsExpanded`, and `hasBeenExpanded`

import React, { Component } from 'react';
import getStyle from './style';
import { constants } from './utilities';

const { collapsingAnimationDurationInSecs } = constants;

function addCollapsing(ComponentToWrap, propName, isExpandedInitially, isToggleIconAnimated) {
  const _isExpandedInitially = isExpandedInitially || false;
  const initialState = {
    containerHeight: undefined,
    isExpanded: _isExpandedInitially,
    isAnimationOn: false,
    hasBeenExpanded: _isExpandedInitially,
    isMoving: false
  };

  return class extends Component {
    constructor(props) {
      super(props);
      this.promiseToSetState = this.promiseToSetState.bind(this);
      this.setHeight = this.setHeight.bind(this);
      this.clearHeight = this.clearHeight.bind(this);
      this.toggle = this.toggle.bind(this);
      this.setIsExpanded = this.setIsExpanded.bind(this);
      this.reset = this.reset.bind(this);
      this.toggleChild = this.toggleChild.bind(this);
      this.containerRef = React.createRef();
      this.state = { ...initialState };
    };

    promiseToSetState(newState) {
      return new Promise(resolve => {
        this.setState(newState, resolve);
      });
    };

    setHeight() {
      return (!this.state.containerHeight && this.containerRef.current) ? (
        this.promiseToSetState(
          { containerHeight: this.containerRef.current.scrollHeight }
        )
      ) : ( // if height already set, clear and then set
        this.clearHeight().then(this.setHeight)
      );
    };

    clearHeight() {
      return this.promiseToSetState({
        containerHeight: undefined,
        isAnimationOn: false
      });
    };

    toggle() {
      if (this.state.isMoving) return;
      return new Promise(resolve => {
        this.setState({
          isExpanded: !this.state.isExpanded,
          isAnimationOn: true,
          hasBeenExpanded: true,
          isMoving: true
        });
        setTimeout(
          () => resolve(this.promiseToSetState({ isMoving: false })),
          collapsingAnimationDurationInSecs * 1000
        );
      });
    };

    setIsExpanded(newIsExpandedValue) {
      if (!!newIsExpandedValue === !!this.state.isExpanded) return;
      return this.toggle();
    };

    reset() {
      return this.promiseToSetState({ ...initialState });
    };

    toggleChild(childContentToggle) {
      if (childContentToggle.isMoving) return;
      return (
        this.clearHeight()
        .then(childContentToggle.toggle)
        .then(this.setHeight)
      );
    };

    render() {

      const {
        containerRef, setHeight, clearHeight, toggle, setIsExpanded, reset, toggleChild
      } = this;

      const { containerHeight, isExpanded, isAnimationOn, hasBeenExpanded, isMoving } = this.state;

      const styles = getStyle(containerHeight, isExpanded, isAnimationOn, isToggleIconAnimated, isMoving);

      const propsToPass = {
        ...this.props,
        [propName]: {
          containerRef,
          setHeight,
          clearHeight,
          toggle,
          styles,
          setIsExpanded,
          hasBeenExpanded,
          isExpanded,
          isHeightSet: !!(containerHeight || containerHeight === 0),
          reset,
          toggleChild,
          isMoving
        }
      };

      return (
        <ComponentToWrap {...propsToPass} />
      );
    };
  };
}

export default addCollapsing;
