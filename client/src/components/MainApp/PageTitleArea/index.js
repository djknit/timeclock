import React from 'react';
import getStyle from './style';
import ContentArea, { ContentAreaTitle } from  '../ContentArea';

function PageTitleArea({
  title,
  children
}) {

  const style = getStyle();

  return (
    <ContentArea style={style.pageTitleArea}>
      <ContentAreaTitle style={style.pageTitle} size={2}>
        {title}
      </ContentAreaTitle>
      {children}
    </ContentArea>
  );
}

export default PageTitleArea;