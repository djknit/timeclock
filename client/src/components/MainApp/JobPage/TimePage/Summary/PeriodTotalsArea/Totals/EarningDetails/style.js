import { pStyle } from '../style';
export * from '../style';

const relatedPGapRatio = 0.9;

export default function getStyle() {
  return {
    firstTotalsP: {
      ...pStyle,
      paddingBottom: `calc(${relatedPGapRatio} * ${pStyle.paddingBottom})`
    },
    lastTotalsP: {
      ...pStyle,
      paddingTop: `calc(${relatedPGapRatio} * ${pStyle.paddingTop})`
    },
    valueLabel: {
      fontWeight: 500
    },
    ratesArea: {
      paddingLeft: '.5em'
    }
  };
};

export {
  relatedPGapRatio
};
