import React from 'react';
import getStyle from './style';

function TagGroup({
  children,
  align,
  isInline,
  size
}) {

  let className = 'tags has-addons';

  let hasAlign;
  if (align === 'center') {
    hasAlign = true;
    className += ' has-text-centered';
  }

  if (size) {
    className += ` are-${size}`;
  }

  const style = getStyle(hasAlign, isInline);

  return (
    <div
      {...{
        style,
        className,
        children
      }}
    />
  );
}

export default TagGroup;