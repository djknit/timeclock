import React from 'react';
import getStyle from './style';
import ContentArea, { ContentAreaTitle } from '../../../ContentArea';
import Button from '../../../../Button';

function Landing({
  childRoutes
}) {

  const style = getStyle();

  return (
    <ContentArea style={style.contentArea}>
      <ContentAreaTitle style={style.contentAreaTitle}>
        Select a Setting (or "All Settings") to View and/or Edit
      </ContentAreaTitle>
      {childRoutes.map(
        ({ pageName, path }) => (
          <Button
            theme="primary"
            isLink
            to={path}
            styles={style.button}
            key={pageName}
          >
            {pageName}
          </Button>
        ) 
      )}
    </ContentArea>
  );
}

export default Landing;