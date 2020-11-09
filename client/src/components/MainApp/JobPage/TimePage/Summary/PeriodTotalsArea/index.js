import React, { Component } from 'react';
import getStyle from './style';
import { keyTriggerCheckerFactory } from '../../../utilities';
import { addCollapsing, addPseudoPseudoClasses } from '../../../../../higherOrder';

class _PeriodTotalsArea_needsCollapsingAndPseudo extends Component {
  // constructor(props) {
    
  // };

  componentDidMount() {
    this.props.contentToggle.setHeight();
  };

  componentDidUpdate(prevProps) {
    const { contentToggle, windowWidth } = this.props;
    if (windowWidth !== prevProps.windowWidth) {
      contentToggle.setHeight();
    }
  };

  render() {
    const { label, contentToggle, pseudoState, pseudoHandlers } = this.props;

    const style = getStyle(contentToggle.styles, pseudoState);

    return (
      <div style={style.area}>
        <p style={style.areaLabel}>{label}</p>
        <hr style={style.labelHr} />

        <div style={style.areaBody} ref={contentToggle.containerRef}>
          test<br/>stuff<br/>...<br/>
        </div>

        <hr style={style.footerHr} />
        <i
          className="fas fa-chevron-up"
          style={style.togglerArrow}
          {...pseudoHandlers}
          onClick={contentToggle.toggle}
          tabIndex={0}
          onKeyDown={keyTriggerCheckerFactory(contentToggle.toggle)}
        />
      </div>
    );
  };
}

const _PeriodTotalsArea_needsCollapsing = addPseudoPseudoClasses(
  _PeriodTotalsArea_needsCollapsingAndPseudo
);

const PeriodTotalsArea = addCollapsing(
  _PeriodTotalsArea_needsCollapsing, 'contentToggle', true
);

export default PeriodTotalsArea;