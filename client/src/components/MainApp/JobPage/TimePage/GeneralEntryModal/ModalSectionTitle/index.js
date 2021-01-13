import React from 'react';
import getStyle from './style';

function ModalSectionTitle({ children, colon }) {

  const style = getStyle();

  return (
    <h3 className="title is-size-5" style={style.title}>
      {children}{colon !== false && ':'}
    </h3>
  );
}

export default ModalSectionTitle;
