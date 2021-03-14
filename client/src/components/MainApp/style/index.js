import { footerHeight } from '../../style';
import { mainAreaPadding } from './mainArea';
export * from '../../style';
export { calculateStyleForPseudoClassState } from '../../higherOrder';
export * from './mainArea';
export * from './contentAreas';
export * from './contentButton';
export * from './infoItemArea';

export default function getStyle(navHeight) {
  return {
    mainContentArea: {
      minHeight: `calc(100vh - ${footerHeight + (navHeight || 0)}px)`,
      padding: mainAreaPadding
    }
  };
};
