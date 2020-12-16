import React from 'react';
import getStyle, { boldStyle } from './style';
import { getTimezoneFullName } from '../utilities';
import Button from '../../../../Button';
import ContentArea from '../../../ContentArea';

function GeneralArea({
  style: styleProp,
  job,
  disabled,
  toggleGeneralEntryModal,
  toggleDeleteSegmentModal
}) {

  const userTimezone = job.time.sessionTimezone;

  const style = getStyle(styleProp);
  
  return (
    <>
      <ContentArea title="Basics" style={style.contentArea}>
        <div style={style.areaNotLastHasBtns}>
          <p style={style.areaHasBtnsText}>
            <Bold>Your Timezone:</Bold> {getTimezoneFullName(userTimezone)}
          </p>
          <p style={style.areaHasBtnsText}>
            Testing testeroo
          </p>
        </div>
        <div style={style.lastAreaHasBtns}>
          <p style={style.areaHasBtnsText}>
            <Bold>General Time Entry:</Bold>
          </p>
          <div style={style.btnsSubArea}>
          <Button
            theme="primary"
            styles={style.firstBtn}
            onClick={() => toggleGeneralEntryModal(true)}
            allowTabFocus={!disabled}
          >
            <i className="fas fa-plus" /> Enter Time
          </Button>
          </div>
          
        </div>
      </ContentArea>
    </>
  );
}

export default GeneralArea;


function Bold({ children }) {
  return (
    <span style={boldStyle}>
      {children}
    </span>
  );
}
