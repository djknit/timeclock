import React from 'react';
import { getColorClass, getSizeClass } from '../utilities';

export { default as TagGroup } from './TagGroup';

function Tag({
  children,
  theme,
  size
}) {

  const colorClass = getColorClass(theme);
  const sizeClass = getSizeClass(size);

  return (
    <span className={`tag ${colorClass} ${sizeClass}`}>
      {children}
    </span>
  );
}

export default Tag;