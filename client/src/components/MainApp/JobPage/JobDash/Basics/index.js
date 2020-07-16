import React from 'react';
import getStyle from './style';
import ContentArea, { ContentAreaTitle } from '../../../ContentArea';
import Button from '../../../../Button';

function BasicsArea({
  job,
  style,
  disabled,
  toggleEditJobNameModal
}) {

  const completeStyle = getStyle(style);

  return (
    <ContentArea title="Basics" style={completeStyle.contentArea}>
      {job &&
        <>
          <div style={completeStyle.areaNotLastHasBtns}>
            <p style={completeStyle.jobNameText}>
              <strong>Job Name:</strong> {job.name}
            </p>
            <Button
              theme="primary"
              styles={completeStyle.firstBtn}
              onClick={() => toggleEditJobNameModal(true)}
              allowTabFocus={!disabled}
            >
              <i className="fas fa-edit" /> Edit
            </Button>
          </div>
        </>
      }
    </ContentArea>
  );
}

export default BasicsArea;