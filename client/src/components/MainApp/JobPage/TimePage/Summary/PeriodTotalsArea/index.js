import React, { Component } from 'react';
import getStyle from './style';
import Header from './Header';
import Body from './Body';
import Footer from './Footer';
import Totals from './Totals';
import { addCollapsing, addPseudoPseudoClasses } from '../../../../../higherOrder';

class _PeriodTotalsArea_needsCollapsingAndPseudo extends Component {
  constructor(props) {
    super(props);
    this.setCollapsingContainerHeights = this.setCollapsingContainerHeights.bind(this);
  };

  setCollapsingContainerHeights() {
    const { mainContentToggle, earningRatesContentToggle } = this.props;
    mainContentToggle.setHeight();
    // earningRatesContentToggle.setHeight();
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
    const { label, mainContentToggle, pseudoState, pseudoHandlers } = this.props;

    const style = getStyle(mainContentToggle.styles, pseudoState);

    return (
      <div style={style.area}>
        <Header {...{ label }} />
        <Body {...{ mainContentToggle }}>
          <Totals />
        </Body>
        <Footer
          arrowPseudoHandlers={pseudoHandlers}
          arrowPseudoState={pseudoState}
          {...{ mainContentToggle }}
        />
      </div>
    );
  };
}

const _PeriodTotalsArea_needsCollapsing = addPseudoPseudoClasses(
  _PeriodTotalsArea_needsCollapsingAndPseudo
);

const _PeriodTotalsArea_needsMoreCollapsing = addCollapsing(
  _PeriodTotalsArea_needsCollapsing, 'mainContentToggle', true
);

const PeriodTotalsArea = addCollapsing(
  _PeriodTotalsArea_needsMoreCollapsing, 'earningRatesContentToggle', false
);

export default PeriodTotalsArea;
