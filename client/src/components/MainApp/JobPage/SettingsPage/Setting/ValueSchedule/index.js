import React from 'react';
import { isFullNavDisplayed } from '../../utilities';
import DesktopVersion from './Desktop';
import MobileVersion from './Mobile';

function ValueSchedule(props) {

  return (
    isFullNavDisplayed(props.windowWidth) ? (
      <DesktopVersion {...props} />
    ) : (
      <MobileVersion {...props} />
    )
  );
}

export default ValueSchedule;
