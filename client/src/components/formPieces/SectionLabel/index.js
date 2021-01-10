import React from 'react';
import getStyle from './style';

function SectionLabel({
  children,
  areaStyle,
  areaRef
}) {

  const style = getStyle(areaStyle);

  return (
    <div className="label" style={style.sectionLabel} ref={areaRef}>
      &nbsp;
      <span style={style.sectionLabelText}>{children}</span>
      <hr style={style.sectionLabelHr} />
    </div>
  );
}

export default SectionLabel;