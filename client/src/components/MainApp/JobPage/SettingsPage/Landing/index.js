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
        ({ pageName, redirector }) => (
          <Button
            theme="primary"
            onClick={redirector}
            styles={style.button}
          >
            {pageName}
          </Button>
        ) 
      )}
    </ContentArea>
  );
}

export default Landing;