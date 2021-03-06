import React from 'react';
import getStyle from './style';

function TagGroup({
  children,
  align,
  isInline,
  size,
  groupMargin,
  tagMargin,
  ...attributes
}) {

  let className = 'tags has-addons';
  if (size) {
    className += ` are-${size}`;
  }

  const style = getStyle(align, isInline, groupMargin, tagMargin);

  return (
    <div {...{ className }} style={style.tagGroup} {...attributes}>
      {children.map((child, index) => (
        React.cloneElement(
          child,
          {
            style: style.tag,
            key: child.key || index
          }
        )
      ))}
    </div>
  );
}

export default TagGroup;