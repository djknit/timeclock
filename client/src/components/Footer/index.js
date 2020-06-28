import React from 'react';
import getStyle from './style';
import OutsideLink from '../OutsideLink';

function Footer({
  areAnyModalsOpen
}) {

  const style = getStyle();

  function FooterLink({ href, children }) {
    return (
      <OutsideLink
        {...{ href }}
        styles={style.linkStyles}
        allowTabFocus={!areAnyModalsOpen}
      >
        {children}
      </OutsideLink>
    );
  }

  return (
    <footer style={style.footer}>
      <div style={style.content}>
        <span style={style.leftText}>
          Developed by <FooterLink href="https://djknit.github.io">David Knittel</FooterLink>
        </span>
        <span style={style.rightText}>
          <FooterLink href="https://github.com/djknit/timeclock">Repo</FooterLink>
        </span>
      </div>
      <div style={style.background}></div>
    </footer>
  );
}

export default Footer;