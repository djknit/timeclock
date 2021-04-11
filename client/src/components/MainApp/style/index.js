import { footerHeight, isWindowWide } from '../../style';
import { mainAreaPadding } from './mainArea';
export * from '../../style';
export { calculateStyleForPseudoClassState } from '../../higherOrder';
export * from './mainArea';
export * from './contentAreas';
export * from './contentButton';
export * from './infoItemArea';

export default function getStyle(navHeight, windowWidth) {
  return {
    mainContentArea: {
      minHeight: `calc(100vh - ${footerHeight + (navHeight || 0)}px)`,
      padding: isWindowWide(windowWidth) ? mainAreaPadding : `${mainAreaPadding} 0`
    }
  };
};
