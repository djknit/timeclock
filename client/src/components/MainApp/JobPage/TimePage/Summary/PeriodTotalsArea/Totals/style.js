const pStyle = { lineHeight: 1.5 };
const detailsPStyle = {
  ...pStyle,
  fontSize: '.85em'
};

export default function getStyle() {
  return {
    basicsP: pStyle,
    detailsP: detailsPStyle,
    earningsDetails: {
      paddingLeft: '0.5rem',
      paddingTop: '0.1em'
    }
  };
};

export { detailsPStyle };
