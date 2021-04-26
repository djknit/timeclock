export { bulmaFormBlack, bulmaFormBlue, isWindowWide } from '../../AppStyle';

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
  },
  amPmInput: {
    marginLeft: '0.5rem'
  },
  control: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  mainInputGroup: {
    display: 'inline-block'
  },
  is24hrInputGroup: {
    display: 'inline-block',
    paddingTop: '0.5rem',
    paddingLeft: '1em'
  },
  is24hrInput: {
    marginRight: 5
  }
};

export { collapsableSectionStyles, timeInputStyles };