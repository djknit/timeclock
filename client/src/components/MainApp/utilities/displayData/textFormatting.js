import React, { Fragment } from 'react';

function convertStringToNonbreakingHtml(string) {
  const spaceSplitString = string.split(' ');
  let htmlPieces= [];
  spaceSplitString.forEach((substring, index) => {
    htmlPieces.push(<>{substring}</>);
    if (index < spaceSplitString.length - 1) {
      htmlPieces.push(<>&nbsp;</>);
    }
  });
  return (
    <>
      {htmlPieces.map((piece, index) => (
        <Fragment key={index}>{piece}</Fragment>
      ))}
    </>
  );
}

export {
  convertStringToNonbreakingHtml
};