import React from 'react';
import { formatMyDate } from '../../../utilities';
import getStyle from './style';
import ContentArea from '../../../ContentArea';
import Button from '../../../../Button';

function BasicsArea({
  job,
  style: styleProp,
  disabled,
  toggleEditJobNameModal,
  toggleDeleteJobModal
}) {

  const style = getStyle(styleProp);

  return (
    <ContentArea title="Basics" style={style.contentArea}>
      {job &&
        <>
          <div style={style.areaNotLastHasBtns}>
            <p style={style.jobNameText}>
              <strong>Job Name:</strong> "{job.name}"
            </p>
            <Button
              theme="primary"
              styles={style.firstBtn}
              onClick={() => toggleEditJobNameModal(true)}
              allowTabFocus={!disabled}
            >
              <i className="fas fa-edit" /> Edit
            </Button>
          </div>
          <div style={style.areaNotLastNoBtns}>
            <p style={style.noBtnsAreaText}>
              <strong>Start Date:</strong> {formatMyDate(job.startDate || {})}
            </p>
          </div>
          <div style={style.lastAreaHasBtnsNoText}>
            <Button
              theme="danger"
              styles={style.firstBtn}
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