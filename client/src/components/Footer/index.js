import React from 'react';
import getStyle from './style';

function Footer() {
  const style = getStyle();

  return (
    <footer style={style.footer}>
      <div style={style.content}>
        TESTERONI
      </div>
      <div style={style.background}>

      </div>
    </footer>
  );
}

export default Footer;