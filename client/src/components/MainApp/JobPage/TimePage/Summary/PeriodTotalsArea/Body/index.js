import React from 'react';
import getStyle from './style';

function Body({ mainContentToggle, children }) {

  const style = getStyle();

  return (
    <div
      style={{ ...mainContentToggle.styles.container, ...style.div }}
      ref={mainContentToggle.containerRef}
    >
      {children}
    </div>
  );
}

export default Body;
