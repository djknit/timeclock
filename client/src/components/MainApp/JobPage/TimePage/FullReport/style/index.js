import { contentAreaDividerColor, contentAreaPadding } from '../../style';
export * from '../../style';
export * from './tableAreas';

/*
NOTE: the element containing this component must be positioned for all styles to work
*/

export default function getStyle(styleProp, isSettingWidths) {

  const borderStyle = `3.4px solid ${contentAreaDividerColor}`;

  const wholeReportStylesIfSettingWidth = isSettingWidths && {
    display: 'inline-block',
    position: 'absolute',
    left: contentAreaPadding,
    minWidth: `calc(100% - ${2 * contentAreaPadding}px)`
  };

  return {
    wholeReport: {
      ...(wholeReportStylesIfSettingWidth || {}),
      borderTop: borderStyle,
      borderBottom: borderStyle,
      ...styleProp
    },
    reportTitle: {
      margin: '0.5em 0'
    }
  };
};
