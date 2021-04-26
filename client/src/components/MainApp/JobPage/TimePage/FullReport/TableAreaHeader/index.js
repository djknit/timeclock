import React from 'react';
import getStyle, { getHeaderStyleVars } from './style';
import InnerAreaHeader from '../../InnerAreaHeader';

function TableAreaHeader({
  label,
  isReportTotals,
  isTotals,
  style: styleProp,
  styleVars: styleVarsProp
}) {

  const style = getStyle(isReportTotals, styleProp);
  const headerStyleVars = getHeaderStyleVars(isTotals, styleVarsProp);
  
  return (
    <InnerAreaHeader
      {...{ label }}
      style={style.header}
      ranking={3}
      styleVariables={headerStyleVars}
      isInSection={isReportTotals}
    />
  );
}

export default TableAreaHeader;
