import React from 'react';
import getStyle from './style';
import ContentArea, { ContentAreaTitle } from '../../../ContentArea';
import Button from '../../../../Button';

function BasicsArea({
  job,
  style,
  disabled
}) {

  const completeStyle = getStyle(style);

  return (
    <ContentArea title="Basics" style={completeStyle.contentArea}>
      {job &&
        <>
          <div style={completeStyle.areaNotLastHasBtns}>
            <p style={completeStyle.areaHasBtnsText}>
              <strong>Job Name:</strong> {job.name}
            </p>
          </div>
          <Button
            theme="primary"
            styles={completeStyle.firstBtn}
            // onClick={}
            allowTabFocus={!disabled}
          ></Button>
        </>
      }
    </ContentArea>
  );
}

export default BasicsArea;