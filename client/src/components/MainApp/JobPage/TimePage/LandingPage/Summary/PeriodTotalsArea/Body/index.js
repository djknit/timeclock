import React from 'react';
import getStyle from './style';

function Body({ mainContentToggle, children }) {

  const style = getStyle();

  return (
    <div
      style={mainContentToggle.styles.container}
      ref={mainContentToggle.containerRef}
    >
      <div style={style.innerDiv}>
        {children}
      </div>
    </div>
  );
}

export default Body;
