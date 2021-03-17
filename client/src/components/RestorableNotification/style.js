import { notificationDefaultMarginBottom } from '../style';

export default function getStyle() {
  return {};
};

export {
  getCollapsedNoteStyle
};


function getCollapsedNoteStyle() {
  return {
    buttonArea: {
      lineHeight: 1,
      textAlign: 'right',
      marginBottom: notificationDefaultMarginBottom
    }
  };
}
