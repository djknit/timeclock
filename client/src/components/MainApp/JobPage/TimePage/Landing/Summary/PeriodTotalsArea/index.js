import React, { Component } from 'react';
import Header from './Header';
import Body from './Body';
import Footer from './Footer';
import Totals from './Totals';
import { addCollapsing } from '../../../../../../higherOrder';

class _PeriodTotalsArea_needsCollapsing extends Component {
  constructor(props) {
    super(props);
    this.setCollapsingContainerHeights = this.setCollapsingContainerHeights.bind(this);
  };

  setCollapsingContainerHeights() {
    const { mainContentToggle, earningsContentToggle } = this.props;
    earningsContentToggle.setHeight().then(mainContentToggle.setHeight);
  };

  componentDidMount() {
    this.setCollapsingContainerHeights();
    const { mainContentToggle, earningsContentToggle } = this.props;
    mainContentToggle.linkParentOrChild(earningsContentToggle);
    earningsContentToggle.linkParentOrChild(mainContentToggle);
  };

  componentDidUpdate(prevProps) {
    if (this.props.windowWidth !== prevProps.windowWidth) {
      this.setCollapsingContainerHeights();
    }
  };

  render() {
    const { label, mainContentToggle, periodTotals, earningsContentToggle, disabled } = this.props;

    return (
      <div>
        <Header {...{ label }} />
        <Body {...{ mainContentToggle }}>
          <Totals {...{ periodTotals, earningsContentToggle, mainContentToggle, disabled }} />
        </Body>
        <Footer contentToggle={mainContentToggle} {...{ disabled }} />
      </div>
    );
  };
}

const _PeriodTotalsArea_needsMoreCollapsing = addCollapsing(
  _PeriodTotalsArea_needsCollapsing, 'earningsContentToggle', false
);

const PeriodTotalsArea = addCollapsing(
  _PeriodTotalsArea_needsMoreCollapsing, 'mainContentToggle', false
);

const PeriodTotalsAreaBeginExpanded = addCollapsing(
  _PeriodTotalsArea_needsMoreCollapsing, 'mainContentToggle', true
);

export default PeriodTotalsArea;

export { PeriodTotalsAreaBeginExpanded };
