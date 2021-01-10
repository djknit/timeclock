import { getInfoItemAreaStyles } from '../style';

export default function getStyle(additionalStyle) {

  const {
    areaHasBtnsText, noBtnsAreaText, ...otherInnerAreaStyles
  } = getInfoItemAreaStyles(undefined, '1em', '0.5em', undefined, 1.2);

  const lineHeight = 1.2;

  return {
    contentArea: {
      ...additionalStyle
    },
    ...otherInnerAreaStyles,
    areaHasBtnsText: {
      ...areaHasBtnsText,
      lineHeight
    },
    noBtnsAreaText: {
      ...noBtnsAreaText,
      lineHeight
    },
    btnsSubArea: {
      paddingTop: '0.3em'
    }
  };
};

const boldStyle = {
  fontWeight: 700
};

export { boldStyle };
