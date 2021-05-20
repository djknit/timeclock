import React, { Component } from 'react';
import getStyle from './style';
import { getClickableElAttrs } from '../utilities';
import { addCollapsing, addPseudoPseudoClasses } from '../../../../../../higherOrder';

class _DropdownForTd_needsCollapsingAndPseudo extends Component {
  constructor(props) {
    super(props);
    this.getDropdownContainerWidth = this.getDropdownContainerWidth.bind(this);
    this.state = {
      getDdContainerWidthTries: 0
    };
  };

  getDropdownContainerWidth() {
    return new Promise(resolve => {
      let { getDdContainerWidthTries } = this.state;
      if (++getDdContainerWidthTries > 5) {
        return this.setState({ getDdContainerWidthTries: 0 }, resolve);
      }
      const { contentToggle } = this.props;
      if (!contentToggle || !contentToggle.containerWidth) {
        return this.setState({ getDdContainerWidthTries }, this.getDropdownContainerWidth);
      }
      resolve(contentToggle.containerWidth);
    });
  };
  
  componentDidMount() {
    if (!this.props.registerDdWidthGetter) return;
    this.props.registerDdWidthGetter(this.getDropdownContainerWidth);
  };
  
  componentWillUnmount() {
    if (!this.props.registerDdWidthGetter) return;
    this.props.unregisterDdWidthGetter(this.getDropdownContainerWidth);
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
