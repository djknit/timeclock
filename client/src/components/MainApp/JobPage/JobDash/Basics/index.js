import React from 'react';
import { formatMyDate } from '../../../utilities';
import getStyle from './style';
import ContentArea, { ContentAreaTitle } from '../../../ContentArea';
import Button from '../../../../Button';

function BasicsArea({
  job,
  style,
  disabled,
  toggleEditJobNameModal,
  toggleDeleteJobModal
}) {

  console.log(job)
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
          <div style={completeStyle.areaNotLastNoBtns}>
            <p style={completeStyle.noBtnsAreaText}>
              <strong>Start Date:</strong> {formatMyDate(job.startDate || {})}
            </p>
          </div>
          <div style={completeStyle.lastAreaHasBtnsNoText}>
            <Button
              theme="danger"
              styles={completeStyle.firstBtn}
              onClick={() => toggleDeleteJobModal(true)}
              allowTabFocus={!disabled}
            >
              <i className="fas fa-trash-alt" /> Delete Job
            </Button>
          </div>
        </>
      }
    </ContentArea>
  );
}

export default BasicsArea;