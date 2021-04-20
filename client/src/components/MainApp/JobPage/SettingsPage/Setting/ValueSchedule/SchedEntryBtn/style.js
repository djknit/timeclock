import { getBtnStyleFromSpecs, adjustBtnSpecs, dashContentBtnSpecs } from '../style';

export default function getStyle(sizeRatio, styleProp) {
  return {
    button: {
      ...getBtnStyleFromSpecs(
        adjustBtnSpecs(dashContentBtnSpecs, sizeRatio)
      ),
      ...styleProp
    }
  };
};
