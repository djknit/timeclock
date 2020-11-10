import React from 'react';

function Body({ mainContentToggle, children }) {

  return (
    <div style={mainContentToggle.styles.container} ref={mainContentToggle.containerRef}>
      {children}
    </div>
  );
}

export default Body;