import { valueLabelStyle, pStyle, relatedPGapRatio } from '../style';

export default function getStyle() {

  const areaLeftPadding = '0.3em';
  const negAreaLeftPadding = `-${areaLeftPadding}`;

  const adjustPadding = (
    originalPadding => `calc(${relatedPGapRatio} * ${originalPadding})`
  );

  return {
    areaLabel: {
      ...pStyle,
      ...valueLabelStyle,
      position: 'relative',
      left: negAreaLeftPadding,
      paddingBottom: adjustPadding(pStyle.paddingBottom)
    },
    p: {
      ...pStyle,
      paddingTop: adjustPadding(pStyle.paddingTop),
      paddingBottom: adjustPadding(pStyle.paddingBottom)
    },
    currencyDetailsArea: {
      paddingLeft: areaLeftPadding,
      // paddingTop: '0.1em'
    }
  };
};
