import React from 'react';
import getStyle from './style';
import questionsPanda from './questions-panda.png';
import { windowWidthService } from '../../data';
import { addData } from '../higherOrder';

function _NotFound_needsData({
  windowWidth
}) {

  const style = getStyle(windowWidth);

  return (
    <div style={style.wholePage}>
      <h1 className="title" style={style.title}>
        Oops! There doesn't seem to be anything here.
      </h1>
      <img src={questionsPanda} style={style.img} />
    </div>
  );
}

const NotFound = addData(_NotFound_needsData, 'windowWidth', windowWidthService);

export default NotFound;