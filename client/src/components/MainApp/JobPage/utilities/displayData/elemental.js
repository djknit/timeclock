import React from 'react';
import { XtSp } from '../../../utilities';

function combineWords(words, isString, useHairSpace) {
  if (isString) return words.join(' ');
  return words.map((word, index) => (
    <React.Fragment key={index}>
      {index !== 0 && (useHairSpace ? <XtSp /> : <>&nbsp;</>)}{word}
    </React.Fragment>
  ));
}

export { combineWords };
