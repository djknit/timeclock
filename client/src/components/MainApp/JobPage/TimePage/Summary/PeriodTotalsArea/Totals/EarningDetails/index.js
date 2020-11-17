import React from 'react';
import getStyle from './style';

function EarningDetails({
  earnings
}) {

  const style = getStyle();

  return (
    <>
      <p style={style.detailsP}>Paid hours</p>
      <p style={style.detailsP}>Unpaid hours:</p>
      <p style={style.detailsP}>rates...</p> 
    </>
  );
}

export default EarningDetails;