import React from 'react';
import getStyle from './style';
import { isFullNavDisplayed } from '../../utilities';
import DesktopVersion from './Desktop';
import MobileVersion from './Mobile';

function ValueSchedule(props) {

  const style = getStyle(props.settingName === 'wage');

  return (
    isFullNavDisplayed(props.windowWidth) ? (
      <DesktopVersion {...props} />
    ) : (
      <MobileVersion {...props} />
    )
  );
}

export default ValueSchedule;
