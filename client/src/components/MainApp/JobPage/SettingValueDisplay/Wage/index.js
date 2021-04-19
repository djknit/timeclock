import React, { Component } from 'react';
import getStyle from './style';
import { processWageValueForDisplay, getClickableElAttrs } from '../../utilities';
import { windowWidthService } from '../../../../../data';
import { addCollapsing, addData, addPseudoPseudoClasses } from '../../../../higherOrder';

class _Wage_needsCollapsingAndDataAndPseudo extends Component {
  constructor(props) {
    super(props);
    this.reportWidth = this.reportWidth.bind(this);
    this.state = {
      detailsWidth: undefined
    };
  };
  
  reportWidth() {
    const { props, state, setState } = this;
    const detailsWidth = props.sectionToggle.containerWidth;
    if (props.setWidth && detailsWidth !== state.detailsWidth) {
      setState({ detailsWidth });
      props.setWidth(detailsWidth);
    }
  };

  componentDidMount() {
    this.reportWidth();
    this.props.sectionToggle.setHeight()
  };

  componentDidUpdate(prevProps) {
    this.reportWidth();
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
      P,
      pStyle,
      detailsMarginTop = '0.4em'
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
          {...getClickableElAttrs(sectionToggle.toggle, disabled)}
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
        <P style={style.p}>  {/* style only applied if `hasP` is true-ish in parent */}
          {basics}
        </P>
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
                  {processedValue.overtime.rateMultiplier} &times; [base rate]
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
