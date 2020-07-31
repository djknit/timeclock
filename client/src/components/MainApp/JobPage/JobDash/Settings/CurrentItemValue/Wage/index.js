import React, { Component } from 'react';
import getStyle from './style';
import { processWageValueForDisplay } from '../../../../utilities';
import { windowWidthService } from '../../../../../../../data';
import { addCollapsing, addData, addPseudoPseudoClasses } from '../../../../../../higherOrder';

class _Wage_needsCollapsingAndDataAndPseudo extends Component {
  constructor(props) {
    super(props);
  };

  componentDidMount() {
    this.props.sectionToggle.setHeight()
  };

  componentDidUpdate(prevProps) {
    const { windowWidth, sectionToggle } = this.props;
    if (windowWidth !== prevProps.windowWidth) {
      sectionToggle.setHeight();
    }
  };

  render() {

    const { sectionToggle, value, pseudoState, pseudoHandlers } = this.props;
    console.log(value)

    // const currenySymbol = getCurrencySymbol(value.currency);
    const processedValue = processWageValueForDisplay(value);
    console.log(processedValue)

    const style = getStyle(sectionToggle.styles, pseudoState);

    return (
      <>
        <p style={style.p}>
          <strong style={style.valueLabel}>
            Current Value:
          </strong>
          &ensp;
          {processedValue.rate}
          <span
            style={style.detailsToggler}
            {...pseudoHandlers}
            tabIndex={0}
            onClick={sectionToggle.toggle}
          >
            <span style={style.toggleOpenText}>Show Details</span>
            <span style={style.toggleClosedText}>Hide Details</span>
            &ensp;
            <i className="fas fa-chevron-up" style={style.togglerArrow} />
          </span>
        </p>
        <div ref={sectionToggle.containerRef} style={style.detailsArea}>
          <p style={style.detailsPNotLast}>
            <strong style={style.valueLabel}>Rate:</strong>
            &ensp;
            {processedValue.rate} / hr
          </p>
          <p style={style.detailsPNotLast}>
            <strong style={style.valueLabel}>Currency:</strong>
            &ensp;
            {processedValue.currency || 'not specified'}
          </p>
          <p style={style.lastDetailsP}>
            <strong style={style.valueLabel}>Overtime:</strong>
            &ensp;
            {processedValue.overtime ? processedValue.overtime.rate : 'off'}
          </p>
          {processedValue.overtime && (
            <>
              <p style={style.subDetailsP}>
                <strong style={style.valueLabel}>OT Type:</strong>
                &ensp;
                {processedValue.overtime.type}
              </p>
              {processedValue.overtime.useMultiplier && (
                <>
                  <p style={style.subDetailsP}>
                    <strong style={style.valueLabel}>OT Multiplier:</strong>
                    &ensp;
                    {processedValue.overtime.rateMultiplier} x [base rate]
                  </p>
                </>
              )}
              <p style={style.subDetailsP}>
                <strong style={style.valueLabel}>OT Rate:</strong>
                &ensp;
                {processedValue.overtime.detailedRate}
              </p>
              <p style={style.subDetailsP}>
                <strong style={style.valueLabel}>OT Begins After:</strong>
                &ensp;
                {processedValue.overtime.cutoff}
              </p>
            </>
          )}
        </div>
      </>
    );
  };
}

const _Wage_needsDataAndPseudo = addCollapsing(
  _Wage_needsCollapsingAndDataAndPseudo, 'sectionToggle', false, true
);

const _Wage_needsPseudo = addData(_Wage_needsDataAndPseudo, 'windowWidth', windowWidthService);

const Wage = addPseudoPseudoClasses(_Wage_needsPseudo);

export default Wage;