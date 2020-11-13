import React, { Component } from 'react';
import getStyle from './style';
import Body from './Body';
import Totals from './Totals';
import TogglerArrow from './TogglerArrow';
import { addCollapsing } from '../../../../../higherOrder';

const getClassName = (elName) => `time-summary-time-period-area-${elName}`;
const labelClass = getClassName('label');
const arrowClass = getClassName('arrow');

class _PeriodTotalsArea_needsCollapsing extends Component {
  constructor(props) {
    super(props);
    this.setCollapsingContainerHeights = this.setCollapsingContainerHeights.bind(this);
  };

  setCollapsingContainerHeights() {
    const { mainContentToggle, earningsContentToggle } = this.props;
    mainContentToggle.setHeight().then(earningsContentToggle.setHeight);
  };

  componentDidMount() {
    this.setCollapsingContainerHeights();
  };

  componentDidUpdate(prevProps) {
    if (this.props.windowWidth !== prevProps.windowWidth) {
      this.setCollapsingContainerHeights();
    }
  };

  render() {
    const { label, mainContentToggle, periodTotals, earningsContentToggle } = this.props;

    const style = getStyle(mainContentToggle.styles);

    return (
      <div style={style.area} >
        <h3 style={style.areaLabel} className={labelClass}>
          {label}
        </h3>
        <div style={style.areaBody} ref={mainContentToggle.containerRef}>
          <Totals {...{ periodTotals, earningsContentToggle, mainContentToggle }} />
        </div>
        <TogglerArrow
          contentToggle={mainContentToggle}
          style={style.togglerArrow}
          className={arrowClass}
        />
      </div>
    );
  };
}

const _PeriodTotalsArea_needsMoreCollapsing = addCollapsing(
  _PeriodTotalsArea_needsCollapsing, 'earningsContentToggle', false
);

function PeriodTotalsArea({ isExpandedInitially, ...otherProps }) {
  const TotalsAreaComp = addCollapsing(
    _PeriodTotalsArea_needsMoreCollapsing, 'mainContentToggle', isExpandedInitially
  );
  return <TotalsAreaComp {...otherProps} />;
}

export default PeriodTotalsArea;
