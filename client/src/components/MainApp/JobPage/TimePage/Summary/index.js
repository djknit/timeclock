import React from 'react';
import getStyle from './style';
import ContentArea from '../../../ContentArea';
import PeriodTotalsArea from './PeriodTotalsArea';

function Summary({
  style: styleProp,
  windowWidth
}) {

  const style = getStyle(styleProp);

  return (
    <ContentArea title="Summary" style={style.contentArea}>
      <div style={style.periodTotalsArea}>
        <p style={style.areaLabel}>
          Job Totals
        </p>
        <p style={style.noBtnsAreaText}>
          Testeroonio
        </p>
        <p style={style.areaHasBtnsText}>
          Numero dos
        </p>
      </div>
      <PeriodTotalsArea
        label="Job Totals"
        {...{ windowWidth }}
      />
    </ContentArea>
  );
}

export default Summary;