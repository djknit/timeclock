import { contentAreaDividerColor, contentAreaPadding } from '../../style';
import { largestDividerHeight } from './tableAreas';
export * from '../../style';
export * from './tableAreas';

/* * *
NOTE: the element containing this component must be positioned for all styles to work
*/

export default function getStyle(styleProp, isSettingWidths, tableWidth) {

  const borderStyle = `calc(${largestDividerHeight} * 1.16) solid ${contentAreaDividerColor}`;

  const wholeReportStylesIfSettingWidth = isSettingWidths && {
    display: 'inline-block',
    position: 'absolute',
    left: contentAreaPadding,
    minWidth: `calc(100% - ${2 * contentAreaPadding}px)`
  };

  const reportTitleMargin = '12px';

  return {
    wholeReport: {
      ...(wholeReportStylesIfSettingWidth || {}),
      borderTop: borderStyle,
      borderBottom: borderStyle,
      padding: `${reportTitleMargin} 0`,
      ...styleProp
    },
    reportTitle: {
      margin: `0 0 ${reportTitleMargin}`
    }
  };
};

const tableCellXPadding = '0.75em';

export {
  tableCellXPadding
};
