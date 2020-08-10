import React from 'react';
import getStyle from './style';
import ContentArea, { ContentAreaTitle } from  '../ContentArea';
import CrumbLink from './CrumbLink';

function PageTitle({
  children,
  style,
  crumbChain
}) {

  const completeStyle = getStyle(style);

  return (
    <ContentArea style={completeStyle.pageTitleArea}>
      <ContentAreaTitle style={completeStyle.pageTitle} size={2}>
        {crumbChain ? (
          crumbChain.map(
            (crumb, index) => (
              index !== crumbChain.length - 1 ? (
                <React.Fragment key={crumb.text}>
                  <CrumbLink to={crumb.url}>
                    {crumb.text}
                  </CrumbLink>
                  <i style={completeStyle.breadcrumbSeparator} className="fas fa-chevron-right" />
                </React.Fragment>
              ) : (
                <span key={crumb.text}>
                  {crumb.text}
                </span>
              )
            )
          )
        ) : (
          children
        )}
      </ContentAreaTitle>
    </ContentArea>
  );
}

export default PageTitle;