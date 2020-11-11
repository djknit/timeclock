import React, { Component } from 'react';
import getStyle from './style';
import { keyTriggerCheckerFactory } from '../../../utilities';
// import Header from './Header';
import Body from './Body';
// import Footer from './Footer';
import Totals from './Totals';
import { addCollapsing, addPseudoPseudoClasses } from '../../../../../higherOrder';

class _PeriodTotalsArea_needsCollapsingAndPseudo extends Component {
  constructor(props) {
    super(props);
    this.setCollapsingContainerHeights = this.setCollapsingContainerHeights.bind(this);
  };

  setCollapsingContainerHeights() {
    const { mainContentToggle, earningsContentToggle } = this.props;
    mainContentToggle.setHeight().then(earningsContentToggle.setHeight);
    // earningsContentToggle.setHeight();
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
    const {
      label, mainContentToggle, pseudoState, pseudoHandlers, periodTotals, earningsContentToggle
    } = this.props;

    const style = getStyle(mainContentToggle.styles, pseudoState);

    return (
      <div
        style={style.area}
        // ref={mainContentToggle.containerRef}
      >
        <p style={style.areaLabel} className="time-summary-time-period-area-label">
          {label}
        </p>
        {/* <Header {...{ label }} /> */}
        <Body {...{ mainContentToggle }}>
          <Totals {...{ periodTotals, earningsContentToggle, mainContentToggle }} />
        </Body>
        {/* <Footer
          arrowPseudoHandlers={pseudoHandlers}
          arrowPseudoState={pseudoState}
          {...{ mainContentToggle }}
        /> */}
        <i
          className="fas fa-chevron-up"
          style={style.togglerArrow}
          {...pseudoHandlers}
          onClick={mainContentToggle.toggle}
          tabIndex={0}
          onKeyDown={keyTriggerCheckerFactory(mainContentToggle.toggle)}
        />
      </div>
    );
  };
}

const _PeriodTotalsArea_needsCollapsing = addPseudoPseudoClasses(
  _PeriodTotalsArea_needsCollapsingAndPseudo
);

const _PeriodTotalsArea_needsMoreCollapsing = addCollapsing(
  _PeriodTotalsArea_needsCollapsing, 'earningsContentToggle', false
);

function PeriodTotalsArea({ isExpandedInitially, ...otherProps }) {
  const TotalsAreaComp = addCollapsing(
    _PeriodTotalsArea_needsMoreCollapsing, 'mainContentToggle', isExpandedInitially
  );
  return <TotalsAreaComp {...otherProps} />
}

export default PeriodTotalsArea;
