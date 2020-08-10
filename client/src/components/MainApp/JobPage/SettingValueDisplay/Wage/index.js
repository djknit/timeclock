import React, { Component } from 'react';
import getStyle from './style';
import { processWageValueForDisplay } from '../../utilities';
import { windowWidthService } from '../../../../../data';
import { addCollapsing, addData, addPseudoPseudoClasses } from '../../../../higherOrder';

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

    const {
      sectionToggle,
      value,
      pseudoState,
      pseudoHandlers,
      disabled,
      label,
      hasP,
      pStyle,
      detailsMarginTop
    } = this.props;

    const processedValue = processWageValueForDisplay(value);

    const style = getStyle(sectionToggle.styles, pseudoState, pStyle, detailsMarginTop);

    const basics = (
      <>
        {label && (
          <>
            <strong style={style.valueLabel}>
              {label}:
            </strong>
            &ensp;
          </>
        )}
        {processedValue.rate}
        <span
          style={style.detailsToggler}
          {...pseudoHandlers}
          tabIndex={disabled ? -1 : 0}
          onClick={sectionToggle.toggle}
        >
          <span style={style.toggleOpenText}>Show Details</span>
          <span style={style.toggleClosedText}>Hide Details</span>
          &ensp;
          <i className="fas fa-chevron-up" style={style.togglerArrow} />
        </span>
      </>
    );

    return (
      <>
        {hasP ? (
          <p style={style.p}>
            {basics}
          </p>
        ) : (
          basics
        )}
        <div ref={sectionToggle.containerRef} style={style.detailsArea}>
          <p style={style.detailsPNotLast}>
            <strong style={style.valueLabel}>Rate:</strong>
            &ensp;
            {processedValue.rate}
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
              <p style={style.subDetailsPNotLast}>
                <strong style={style.valueLabel}>OT Type:</strong>
                &ensp;
                {processedValue.overtime.type}
              </p>
              {processedValue.overtime.useMultiplier && (
                <p style={style.subDetailsPNotLast}>
                  <strong style={style.valueLabel}>OT Multiplier:</strong>
                  &ensp;
                  {processedValue.overtime.rateMultiplier} x [base rate]
                </p>
              )}
              <p style={style.subDetailsPNotLast}>
                <strong style={style.valueLabel}>OT Rate:</strong>
                &ensp;
                {processedValue.overtime.detailedRate}
              </p>
              <p style={style.lastSubDetailsP}>
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