import React from 'react';
import getStyle from './style';

function TagGroup({
  children,
  align,
  isInline,
  size,
  groupMargin,
  tagMargin
}) {

  let className = 'tags has-addons';
  // if (align === 'center') {
  //   // className += ' has-text-centered';
  // }
  // if (align && align !== 'center') {
  //   className += ` has-text-${align}`
  // }
  if (size) {
    className += ` are-${size}`;
  }

  const style = getStyle(align, isInline, groupMargin, tagMargin);

  return (
    <div {...{ className }} style={style.tagGroup}>
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