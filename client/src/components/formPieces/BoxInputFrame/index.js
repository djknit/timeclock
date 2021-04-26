import React from 'react';
import getStyle from './style';
import Control from './Control';
import Label from './Label';
import FieldMessages from './Messages';
import { windowWidthService } from '../../../data';
import { addData } from '../../higherOrder';

function _BoxInputFrame_needsData({
  label,
  sublabel,
  isInline,
  inputId,
  children,
  hasIcon,
  styles,
  isRadio,
  windowWidth,
  selectedRadioInput,
  fieldToLabelRatio,
  helpText,
  problemMessages
  // isLastChild // Will be needed if bottom margin is changed from Bulma style.
}) {

  const style = getStyle(styles, windowWidth, fieldToLabelRatio, isInline);

  const fieldAttrs = {
    style: style.field,
    ...(isRadio && {
      role: 'group',
      'aria-label': `${label} ${sublabel || ''}`
    })
  };
  const labelAttrs = {
    label,
    sublabel,
    inputId,
    isRadio,
    selectedRadioInput,
    style: style.label
  };
  const controlAttrs = { isRadio, hasIcon, windowWidth, style: style.control };

  return isInline ? (
    <div
      className="field is-horizontal"
      {...fieldAttrs}
    >
      <div className="field-label is-normal" style={style.fieldLabel}>
        <Label {...labelAttrs} />
      </div>
      <div className="field-body" style={style.subSectionFieldBody}>
        <div className="field">
          <Control isInline {...controlAttrs}>
            {children}
          </Control>
          <FieldMessages {...{ helpText, problemMessages }} />
        </div>
      </div>
    </div>
  ) : (
    <div className="field" {...fieldAttrs}>
      <Label {...labelAttrs} />
      <Control {...controlAttrs}>
        {children}
      </Control>
      <FieldMessages {...{ helpText, problemMessages }} />
    </div>
  );
}

const BoxInputFrame = addData(_BoxInputFrame_needsData, 'windowWidth', windowWidthService); // Should maybe get as props instead to minimize event listeners. Would improve performance?

export default BoxInputFrame;
