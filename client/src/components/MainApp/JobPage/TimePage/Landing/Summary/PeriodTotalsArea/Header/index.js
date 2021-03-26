import React from 'react';
import getStyle from './style';

function Header({ label }) {

  const style = getStyle();

  return (
    <div style={style.div}>
      <h3 style={style.areaLabel}>
        {label}
      </h3>
      <hr style={style.labelHr} />
    </div>
  );
}

export default Header;
