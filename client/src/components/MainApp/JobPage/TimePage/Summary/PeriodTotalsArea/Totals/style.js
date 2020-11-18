const pStyle = { lineHeight: 1.5 };

export default function getStyle() {
  return {
    basicsP: pStyle,
    detailsP: {
      ...pStyle,
      fontSize: '0.85em'
    },
    earningsDetails: {
      paddingLeft: '0.5rem',
      paddingTop: '0.1em'
    }
  };
};

export { pStyle };
