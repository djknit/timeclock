import React, { Component } from 'react';
import Header from './Header';
import Body from './Body';
import Footer from './Footer';
import Totals from './Totals';
import { addCollapsing } from '../../../../../higherOrder';

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
  };

  componentDidUpdate(prevProps) {
    if (this.props.windowWidth !== prevProps.windowWidth) {
      this.setCollapsingContainerHeights();
    }
  };

  render() {
    const { label, mainContentToggle, periodTotals, earningsContentToggle } = this.props;

    return (
      <div>
        <Header {...{ label }} />
        <Body {...{ mainContentToggle }}>
          <Totals {...{ periodTotals, earningsContentToggle, mainContentToggle }} />
        </Body>
        <Footer {...{ mainContentToggle }} />
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
  return (
    <TotalsAreaComp {...otherProps} />
  );
}

export default PeriodTotalsArea;
