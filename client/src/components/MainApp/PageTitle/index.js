import React from 'react';
import getStyle from './style';
import ContentArea, { ContentAreaTitle } from  '../ContentArea';

function PageTitle({
  children,
  style
}) {

  return (
    <PageTitleArea {...{ style }}>
      <PageTitleText>{children}</PageTitleText>
    </PageTitleArea>
  );
}

function PageTitleArea({
  children,
  style
}) {

  const completeStyle = getStyle(style);

  return (
    <ContentArea style={completeStyle.pageTitleArea}>
      {children}
    </ContentArea>
  );
}

function PageTitleText({
  children
}) {

  const style = getStyle();

  return (
    <ContentAreaTitle style={style.pageTitle} size={2}>
      {children}
    </ContentAreaTitle>
  );
}

export default PageTitle;