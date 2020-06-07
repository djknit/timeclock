import React from 'react';
import getStyle from './style';

function SectionLabel({
  children
}) {

  const style = getStyle();

  return (
    <div className="label" style={style.sectionLabel}>
      &nbsp;
      <span style={style.sectionLabelText}>{children}</span>
      <hr style={style.sectionLabelHr} />
    </div>
  );
}

export default SectionLabel;