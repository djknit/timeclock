export { bulmaFormBlack, bulmaFormBlue } from '../../AppStyle';

function isWindowWide(windowWidth) {
  return windowWidth >= 769;
};

const collapsableSectionStyles = {
  outsideField: {
    marginBottom: 0
  },
  firstInsideField: {
    marginTop: '.75rem' // matches Bulma field bottom margin
  }
};

export { isWindowWide, collapsableSectionStyles };