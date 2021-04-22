import React from 'react';
import getStyle from './style';
import PageTitle from '../../../PageTitle';
import Summary from './Summary';
import General from './General';
import Reports from './Reports';

function Landing({
  windowWidth,
  job,
  areAnyModalsOpen,
  toggleGeneralEntryModal,
  toggleDeleteSegmentModal,
  toggleRecentlyAddedModal,
  toggleSessionTimezoneModal,
  crumbChain
}) {

  const commonAreaAttrs = { job, windowWidth, disabled: areAnyModalsOpen };

  const style = getStyle(windowWidth);

  return (
    <>
      <PageTitle {...{ crumbChain, areAnyModalsOpen }} />
      <div style={style.contentAreasRow}>
        <Summary
          {...commonAreaAttrs}
          style={style.summaryArea}
          timeData={job.time}
        />
        <General
          {...commonAreaAttrs}
          style={style.generalEntryArea}
          {...{
            toggleGeneralEntryModal,
            toggleDeleteSegmentModal,
            toggleRecentlyAddedModal,
            toggleSessionTimezoneModal
          }}
        />
      </div>
      <Reports
        {...commonAreaAttrs}
        style={style.reportsArea}
      />
    </>
  );
}

export default Landing;
