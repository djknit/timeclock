import React from 'react';
import getStyle from './style';
import OutsideLink from '../OutsideLink';

function Footer() {
  const style = getStyle();

  return (
    <footer style={style.footer}>
      <div style={style.content}>
        <span style={style.leftText}>
          Developed by <OutsideLink href="https://djknit.github.io" styles={style.linkStyles}>David Knittel</OutsideLink>
        </span>
        <span style={style.rightText}>
          <OutsideLink href="https://github.com/djknit/timeclock" styles={style.linkStyles}>Repo</OutsideLink>
        </span>
      </div>
      <div style={style.background}>

      </div>
    </footer>
  );
}

export default Footer;