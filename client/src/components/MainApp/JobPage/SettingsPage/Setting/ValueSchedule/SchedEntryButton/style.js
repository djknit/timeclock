import { getBtnStyleFromSpecs, adjustBtnSpecs, dashContentBtnSpecs } from '../style';

export default function getStyle(sizeRatio) {
  return {
    button: getBtnStyleFromSpecs(
      adjustBtnSpecs(dashContentBtnSpecs, sizeRatio)
    )
  };
};
