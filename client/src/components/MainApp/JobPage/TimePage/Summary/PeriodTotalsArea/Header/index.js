import React from 'react';
import getStyle from './style';

function Header({ label }) {

  const style = getStyle();

  return (
    <>
      <p style={style.areaLabel}>
        {label}
      </p>
      <hr style={style.labelHr} />
    </>
  );
}

export default Header;