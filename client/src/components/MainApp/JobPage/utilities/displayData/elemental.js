import React from 'react';

function combineWords(words, isString) {
  if (isString) return words.join(' ');
  return words.map((word, index) => (
    <React.Fragment key={index}>
      {index !== 0 && (<>&nbsp;</>)}{word}
    </React.Fragment>
  ));
}

export { combineWords };
