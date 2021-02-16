import { getInfoItemAreaStyles, contentAreaPadding } from '../style';

export default function getStyle(additionalStyle) {

  const {
    areaHasBtnsText, noBtnsAreaText, firstBtn, btnNotFirst, ...otherInnerAreaStyles
  } = getInfoItemAreaStyles(undefined, '1em', '0.5em', undefined, 1.2);

  const lineHeight = 1.2;

  const btnMargin = btnNotFirst.innate.marginLeft;

  return {
    contentArea: {
      ...additionalStyle,
      paddingBottom: `calc(${contentAreaPadding}px - ${btnMargin})`
    },
    firstBtn: {
      ...firstBtn,
      innate: {
        ...firstBtn.innate,
        marginBottom: btnMargin
      }
    },
    btnNotFirst: {
      ...btnNotFirst,
      innate: {
        ...btnNotFirst.innate,
        marginBottom: btnMargin
      }
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
