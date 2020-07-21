import { getInfoItemAreaStyles } from '../style';

export default function getStyle(additionalStyle) {
  
  const accountPropAreaStyles = getInfoItemAreaStyles(undefined, undefined, undefined, undefined, 1.3);

  return {
    contentArea: {
      ...additionalStyle
    },
    accountPropAreaNotLast: accountPropAreaStyles.areaNotLastHasBtns,
    lastAccountPropArea: accountPropAreaStyles.lastAreaHasBtns,
    propAreaText: accountPropAreaStyles.areaHasBtnsText,
    button: accountPropAreaStyles.firstBtn,
    buttonNotFirst: accountPropAreaStyles.btnNotFirst,
  };
};