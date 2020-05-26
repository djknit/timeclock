import React from 'react';
import getStyle from './style';
import Control from './Control';
import Label from './Label';

function BoxInputFrame({
  label,
  sublabel,
  isInline,
  inputId,
  // sizeRatio,
  children,
  hasIcon,
  styles,
  // hasSmallMargins,
  // isLastChild
}) {

  // no need for inline when there is no label
  if (label === undefined) isInline = false;

  const style = getStyle(styles);

  const labelProps = { style: style.label, label, inputId, sublabel };

  return isInline ?
    (
      <div className="field is-horizontal">
        <div className="field-label is-normal">
          <Label {...labelProps} />
        </div>
        <div className="field-body">
          <div className="field">
            <Control isInline hasIcon={hasIcon}>
              {children}
            </Control>
          </div>
        </div>
      </div>
    ) :
    (
      <div className="field">
        <Label {...labelProps} />
        <Control hasIcon={hasIcon}>
          {children}
        </Control>
      </div>
    );
}

export default BoxInputFrame;