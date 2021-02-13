import React from 'react';
import getStyle from './style';
import Control from './Control';
import Label from './Label';
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
  helpText
  // isLastChild // Will be needed if bottom margin is changed from Bulma style.
}) {

  // no need for inline when there is no label (probably)
  if (label === undefined) isInline = false;

  const style = getStyle(styles, windowWidth, fieldToLabelRatio, isInline);

  const labelProps = { style: style.label, label, inputId, sublabel };

  let fieldAttributes = (
    isRadio ?
    {
      role: 'group',
      'aria-label': `${label} ${sublabel || ''}`
    } :
    {}
  );
  fieldAttributes.style = style.field;
  const labelAttributes = { ...labelProps, isRadio, selectedRadioInput };

  const controlAttrs = { isRadio, hasIcon, windowWidth };

  const helpTextHtml = helpText && (
    <p className="help">{helpText}</p>
  );

  return isInline ? (
    <div
      className="field is-horizontal"
      {...fieldAttributes}
    >
      <div className="field-label is-normal" style={style.fieldLabel}>
        <Label {...labelAttributes} />
      </div>
      <div className="field-body" style={style.subSectionFieldBody}>
        <div className="field">
          <Control isInline {...controlAttrs}>
            {children}
          </Control>
          {helpTextHtml}
        </div>
      </div>
    </div>
  ) : (
    <div className="field" {...fieldAttributes}>
      <Label {...labelAttributes} />
      <Control {...controlAttrs}>
        {children}
      </Control>
      {helpTextHtml}
    </div>
  );
}

const BoxInputFrame = addData(_BoxInputFrame_needsData, 'windowWidth', windowWidthService);

export default BoxInputFrame;
