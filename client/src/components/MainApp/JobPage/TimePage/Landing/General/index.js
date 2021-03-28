import React from 'react';
import getStyle, { boldStyle } from './style';
import { getTimezoneFullName } from '../../utilities';
import Button from '../../../../../Button';
import ContentArea from '../../../../ContentArea';

function GeneralArea({
  style: styleProp,
  job,
  disabled,
  toggleGeneralEntryModal,
  toggleSessionTimezoneModal,
  toggleRecentlyAddedModal
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
          <div style={style.btnsSubArea}>
            <Button
              theme="info light"
              styles={style.firstBtn}
              onClick={() => toggleSessionTimezoneModal(true)}
              allowTabFocus={!disabled}
            >
              <i className="fas fa-info-circle" /><i className="fas fa-pencil-alt" /> About/Change
            </Button>
          </div>
        </div>
        <div style={style.lastAreaHasBtns}>
          <p style={style.areaHasBtnsText}>
            <Bold>General Time Entry:</Bold>
          </p>
          <div style={style.btnsSubArea}>
            <Button
              theme="primary light"
              styles={style.firstBtn}
              onClick={() => toggleRecentlyAddedModal(true)}
              allowTabFocus={!disabled}
            >
              <i className="fas fa-history" /> Recently Added
            </Button>
            <Button
              theme="primary"
              styles={style.btnNotFirst}
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
