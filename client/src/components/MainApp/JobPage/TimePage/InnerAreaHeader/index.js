import React from 'react';
import getStyle from './style';
import * as styles from './style';
export { styles };

function InnerAreaHeader({
  label,
  style: styleProp,
  styleVariables,
  children,
  ranking,
  isInSection
}) {

  const style = getStyle(styleProp, styleVariables);

  return (
    <Container style={style.div} {...{ isInSection }}>
      <Hx style={style.text} {...{ ranking }}>
        {label}
      </Hx>
      <hr style={style.hr} />
      {children}
    </Container>
  );
}

export default InnerAreaHeader;


function Container({
  isInSection,
  ...props
}) {
  return isInSection ? (
    <header {...props} />
  ) : (
    <div {...props} />
  );
}

function Hx({
  ranking = 2,
  ...props
}) {
  switch (ranking) {
    case 1: return <h1 {...props} />;
    case 2: return <h2 {...props} />;
    case 3: return <h3 {...props} />;
    case 4: return <h4 {...props} />;
    case 5: return <h5 {...props} />;
    case 6: return <h6 {...props} />;
  }
}
