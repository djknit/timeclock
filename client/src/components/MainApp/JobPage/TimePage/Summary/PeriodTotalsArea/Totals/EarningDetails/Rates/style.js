import { pStyle, relatedPGapRatio } from '../style';

export default function getStyle(isDoubleEmbedded) {

  const gapRatio = relatedPGapRatio ** (isDoubleEmbedded ? 2 : 1);
  const adjustPadding = (
    (originalPadding, ratio) => `calc(${ratio || gapRatio} * ${originalPadding})`
  );

  const areaPaddingLeft = '0.4em';
  const negAreaPaddingLeft = `-${areaPaddingLeft}`;
  
  return {
    area: {
      paddingLeft: areaPaddingLeft
    },
    areaLabel: {
      ...pStyle,
      position: 'relative',
      left: negAreaPaddingLeft,
      paddingTop: adjustPadding(pStyle.paddingTop, relatedPGapRatio),
      paddingBottom: adjustPadding(pStyle.paddingBottom)
    },
    p: {
      ...pStyle,
      paddingTop: adjustPadding(pStyle.paddingTop),
      paddingBottom: adjustPadding(pStyle.paddingBottom)
    },

  };
};
