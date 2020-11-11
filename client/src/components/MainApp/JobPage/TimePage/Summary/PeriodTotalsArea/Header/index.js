import React from 'react';
import getStyle from './style';

function Header({ label }) {

  const style = getStyle();

  return (
    <div style={style.div}>
      <p style={style.areaLabel}>
        {label}
      </p>
      <hr style={style.labelHr} />
    </div>
  );
}

export default Header;