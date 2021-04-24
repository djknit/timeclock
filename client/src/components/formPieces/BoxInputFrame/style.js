import { isWindowWide } from '../style';

const defaultFieldToLabelRatio = 5.8;

export default function(
  styles = {},
  windowWidth,
  fieldToLabelRatio = defaultFieldToLabelRatio,
  isInline,
  topLevelFieldLabelRatio = defaultFieldToLabelRatio
) {

  const labelStyles = (
    (!isWindowWide(windowWidth) && isInline) ?
    { textAlign: 'left' } :
    {}
  );
  const additionalLabelStyles = styles.label;

  let field = {
    ...(!isWindowWide(windowWidth) && {
      paddingLeft: `${getFieldIndentPercent(fieldToLabelRatio, topLevelFieldLabelRatio)}%`
    }),
    ...styles.field
  };

  return {
    ...styles,
    field: { ...field, ...styles.field },
    normalWeight: {
      fontWeight: 'normal'
    },
    subSectionFieldBody: (
      isWindowWide(windowWidth) ?
      { flexGrow: fieldToLabelRatio || 5 } :
      {}
    ),
    label: { ...labelStyles, ...additionalLabelStyles },
    helpText: {
      textAlign: 'left'
    }
  };
};


function getFieldIndentPercent(fieldToLabelRatio, topLevelFieldLabelRatio) {
  const fieldWidthOfFormFraction = (
    _getFieldWidthFraction(fieldToLabelRatio) / _getFieldWidthFraction(topLevelFieldLabelRatio)
  );
  return (1 - fieldWidthOfFormFraction) * 100;
  function _getFieldWidthFraction(_fieldLabelRatio) {
    return (_fieldLabelRatio / (1 + _fieldLabelRatio));
  }
}
