import React from 'react';
import getStyle from './style';
import { getColorClass, getSizeClass } from '../utilities';

export { default as TagGroup } from './TagGroup';

function Tag({
  theme,
  size,
  style: styleProp,
  emHeight,
  lineHeight,
  styleVars,
  ...attrs
}) {

  const colorClass = getColorClass(theme);
  const sizeClass = getSizeClass(size);

  const style = getStyle(styleProp, styleVars);

  return (
    <span
      className={`tag ${colorClass} ${sizeClass}`}
      style={style.tag}
      {...attrs}
    />
  );
}

export default Tag;
