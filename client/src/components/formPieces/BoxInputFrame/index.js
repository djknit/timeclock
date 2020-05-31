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
  // sizeRatio,
  children,
  hasIcon,
  styles,
  isRadio,
  windowWidth,
  selectedRadioInput
  // hasSmallMargins,
  // isLastChild
}) {

  // no need for inline when there is no label
  if (label === undefined) isInline = false;

  const style = getStyle(styles, windowWidth);

  const labelProps = { style: style.label, label, inputId, sublabel };

  let fieldAttributes = (
    isRadio ?
    {
      role: 'group',
      'aria-label': `${label} ${sublabel || ''}`
    } :
    {}
  );
  const labelAttributes = { ...labelProps, isRadio, windowWidth, selectedRadioInput };

  return isInline ?
    (
      <div
        className="field is-horizontal"
        {...fieldAttributes}
      >
        <div className="field-label is-normal">
          <Label {...labelAttributes} />
        </div>
        <div className="field-body">
          <div className="field">
            <Control isInline {...{ isRadio, hasIcon, windowWidth }}>
              {children}
            </Control>
          </div>
        </div>
      </div>
    ) :
    (
      <div className="field" {...fieldAttributes}>
        <Label {...labelAttributes} />
        <Control {...{ isRadio, hasIcon, windowWidth }}>
          {children}
        </Control>
      </div>
    );
}

const BoxInputFrame = addData(_BoxInputFrame_needsData, 'windowWidth', windowWidthService);

export default BoxInputFrame;