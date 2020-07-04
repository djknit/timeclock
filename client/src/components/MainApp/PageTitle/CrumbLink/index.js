import React from 'react';
import { Link } from 'react-router-dom';
import getStyle from './style';
import { addPseudoPseudoClasses } from '../../../higherOrder';

function _CrumbLink_needsPseudo({
  pseudoState,
  pseudoHandlers,
  children,
  to
}) {

  const style = getStyle(pseudoState);

  return (
    <Link {...{ to, children, ...pseudoHandlers, style }} />
  );
}

const CrumbLink = addPseudoPseudoClasses(_CrumbLink_needsPseudo);

export default CrumbLink;