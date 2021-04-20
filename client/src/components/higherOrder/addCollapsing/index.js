// ABOUT THIS FILE:
// This HOC is responsible for managing state for a collapsing containter and toggle button.
// One prop is passed to wrapped component whose name is given as a parameter to the HOC function.
  // The passed prop is an object with the needed properties and methods

import React, { Component } from 'react';
import getStyle from './style';
import { constants } from './utilities';

const { collapsingAnimationDurationInSecs } = constants;

function addCollapsing(ComponentToWrap, propName, isExpandedInitially, isToggleIconAnimated) {
  const _isExpandedInitially = isExpandedInitially || false;
  const initialState = {
    containerHeight: undefined,
    containerWidth: undefined,
    isExpanded: _isExpandedInitially,
    isAnimationOn: false,
    hasBeenExpanded: _isExpandedInitially,
    isMoving: false,
    parentOrChild: undefined
  };

  return class extends Component {
    constructor(props) {
      super(props);
      this.promiseToSetState = this.promiseToSetState.bind(this);
      this.setHeight = this.setHeight.bind(this);
      this.clearHeight = this.clearHeight.bind(this);
      this.toggle = this.toggle.bind(this);
      this.toggleThisToggleOnly = this.toggleThisToggleOnly.bind(this);
      this.toggleWithParentOrChild = this.toggleWithParentOrChild.bind(this);
      this.linkParentOrChild = this.linkParentOrChild.bind(this);
      this.setIsExpanded = this.setIsExpanded.bind(this);
      this.pauseAnimation = this.pauseAnimation.bind(this);
      this.reset = this.reset.bind(this);
      this.containerRef = React.createRef();
      this.state = { ...initialState };
    };

    promiseToSetState(newState) {
      return new Promise(resolve => {
        this.setState(newState, resolve);
      });
    };

    setHeight() {
      const containerEl = this.containerRef.current;
      if (!containerEl) {
        return this.promiseToSetState({ isMoving: false });
      };
      return (!this.state.containerHeight) ? (
        this.promiseToSetState({
          containerHeight: containerEl.scrollHeight,
          containerWidth: containerEl.scrollWidth,
          isMoving: false
        })
      ) : ( // if height already set, clear and then set
        this.clearHeight().then(this.setHeight)
      );
    };

    clearHeight() {
      return this.promiseToSetState({
        containerHeight: undefined,
        isAnimationOn: false,
        isMoving: true
      });
    };

    toggle() {
      const { parentOrChild, isMoving, containerHeight } = this.state;
      if (isMoving) return;
      if (!containerHeight) {
        return this.setHeight().then(this.toggle);
      }
      return parentOrChild ? (
        this.toggleWithParentOrChild(parentOrChild)
      ) : (
        this.toggleThisToggleOnly()
      );
    };

    toggleThisToggleOnly() {
      return new Promise(resolve => {
        this.setState({
          isExpanded: !this.state.isExpanded,
          isAnimationOn: true,
          hasBeenExpanded: true,
          isMoving: true
        });
        setTimeout(
          () => resolve(this.promiseToSetState({ isMoving: false })),
          (this.props.animationDurationInSecs || collapsingAnimationDurationInSecs) * 1000
        );
      });
    };

    toggleWithParentOrChild(parentOrChildToggle) {
      return (
        parentOrChildToggle.clearHeight()
        .then(this.toggleThisToggleOnly)
        .then(parentOrChildToggle.setHeight)
      );
    };

    linkParentOrChild(parentOrChild) {
      this.setState({ parentOrChild });
    };

    setIsExpanded(newIsExpandedValue) {
      if (!!newIsExpandedValue === !!this.state.isExpanded) return;
      return this.toggle();
    };

    pauseAnimation() {
      this.setState({ isAnimationOn: false });
    };

    reset() {
      return this.promiseToSetState({ ...initialState });
    };

    render() {

      const {
        containerRef, setHeight, clearHeight, toggle, setIsExpanded, reset, linkParentOrChild, pauseAnimation
      } = this;
      const { animationDurationInSecs = collapsingAnimationDurationInSecs } = this.props;
      const {
        containerHeight, isExpanded, isAnimationOn, hasBeenExpanded, isMoving, containerWidth
      } = this.state;

      const styles = getStyle(
        containerHeight, isExpanded, isAnimationOn, isToggleIconAnimated, isMoving, animationDurationInSecs
      );

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
          isMoving,
          linkParentOrChild,
          pauseAnimation,
          containerWidth
        }
      };

      return (
        <ComponentToWrap {...propsToPass} />
      );
    };
  };
}

export default addCollapsing;
