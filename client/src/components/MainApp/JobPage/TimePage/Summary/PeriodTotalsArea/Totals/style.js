export * from '../style';

const pYPadding = '0.25em';
const pStyle = {
  lineHeight: 1,
  paddingTop: pYPadding,
  paddingBottom: pYPadding
};
const valueLabelStyle = {
  fontWeight: 500
};

export default function getStyle() {
  return {
    basicsP: pStyle,
    detailsP: {
      ...pStyle,
      fontSize: '0.85em'
    },
    valueLabel: valueLabelStyle,
    earningsDetailsArea: {
      fontSize: '0.9em',
      paddingLeft: '0.5rem',
      paddingTop: '0.1em'
    }
  };
};

export {
  pStyle,
  valueLabelStyle
};
