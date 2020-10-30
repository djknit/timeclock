import React from 'react';
import getStyle from './style';
import ContentArea from '../../../ContentArea';

function Summary({
  style: styleProp
}) {

  const style = getStyle(styleProp);

  return (
    <ContentArea title="Summary" style={style.contentArea}>
      <div style={style.areaNotLastHasBtns}>
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
    </ContentArea>
  );
}

export default Summary;