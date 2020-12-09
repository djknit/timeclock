import React from 'react';
import getStyle from './style';
import Button from '../../../../Button';
import ContentArea from '../../../ContentArea';

function GeneralEntry({
  style: styleProp,
  job,
  toggleGeneralEntryModal,
  toggleDeleteSegmentModal
}) {

  const style = getStyle(styleProp);
  
  return (
    <>
      <ContentArea title="Enter Time" style={style.contentArea}>
        <Button
          theme="primary"
          onClick={() => toggleGeneralEntryModal(true)}
        >
          <i className="fas fa-plus" /> Enter Time
        </Button>
      </ContentArea>
    </>
  );
}

export default GeneralEntry;