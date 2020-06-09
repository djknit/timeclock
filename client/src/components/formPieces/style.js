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

const timeInputStyles = {
  colon: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    padding: '1px .3em'
  },
  minutesInput: {
    width: '3.5em',
    textAlign: 'left'
  }
};

export { isWindowWide, collapsableSectionStyles, timeInputStyles };