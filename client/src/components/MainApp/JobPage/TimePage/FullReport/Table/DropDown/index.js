import React, { Component } from 'react';
import getStyle from './style';
import { getClickableElAttrs } from '../utilities';
import { addCollapsing, addPseudoPseudoClasses } from '../../../../../../higherOrder';

class _DropdownForTd_needsCollapsingAndPseudo extends Component {
  constructor(props) {
    super(props);
    this.getDdContainerWidth = this.getDdContainerWidth.bind(this);
    this.state = {
      getWidthTries: 0
    };
  };

  getDdContainerWidth() {
    return new Promise(resolve => {
      let { getWidthTries } = this.state;
      if (++getWidthTries > 4) {
        return this.setState({ getWidthTries: 0 }, resolve);
      }
      const { contentToggle } = this.props;
      if (!contentToggle || !contentToggle.containerWidth) {
        return this.setState({ getWidthTries }, this.getDdContainerWidth);
      }
      resolve(contentToggle.containerWidth);
    });
  };
  
  componentDidMount() {
    if (!this.props.registerWidthGetter) return;
    this.props.registerWidthGetter(this.getDdContainerWidth);
  };
  
  render() {
  
    const {
      contentToggle,
      pseudoState,
      pseudoHandlers,
      children,
      disabled
    } = this.props;
    // console.log('td dd contentToggle:\n ', contentToggle);
  
    const style = getStyle(pseudoState, contentToggle.styles);
  
    return (
      <>
        <i
          className="fas fa-chevron-up"
          style={style.togglerArrow}
          {...pseudoHandlers}
          {...getClickableElAttrs(contentToggle.toggle, disabled)}
        />
        <span
          style={style.dropdownContainer}
          ref={contentToggle.containerRef}
          {...{ children }}
        />
      </>
    );
  }
};

const _DropdownForTd_needsPseudo = addCollapsing(
  _DropdownForTd_needsCollapsingAndPseudo, 'contentToggle', false, true
);
const DropdownForTd = addPseudoPseudoClasses(_DropdownForTd_needsPseudo);

export default DropdownForTd;
