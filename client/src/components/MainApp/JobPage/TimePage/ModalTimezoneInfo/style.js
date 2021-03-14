// import { calculateStyleForPseudoClassState } from '../../../../higherOrder';
import { minorInModalButtonStyle } from '../style';
export * from '../style';

export default function getStyle() {

  const inNotificationBtnMargin = '1rem'

  return {
    notification: {
      width: 'auto',
      marginRight: 0,
      marginLeft: 'auto',
      textAlign: 'right',
      paddingBottom: inNotificationBtnMargin
    },
    inNotificationBtn: {
      ...minorInModalButtonStyle,
      position: 'relative',
      right: `calc(-40px + ${inNotificationBtnMargin})`
    }
  };
};
