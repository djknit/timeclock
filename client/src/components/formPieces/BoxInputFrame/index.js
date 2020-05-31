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
  isRadio
  // hasSmallMargins,
  // isLastChild
}) {

  // no need for inline when there is no label
  if (label === undefined) isInline = false;

  const style = getStyle(styles);

  const labelProps = { style: style.label, label, inputId, sublabel };

  return isInline ?
    (
      <Field className="field is-horizontal">
        <div className="field-label is-normal">
          <Label {...{ ...labelProps, isRadio }} />
        </div>
        <div className="field-body">
          <div className="field">
            <Control isInline {...{ isRadio, hasIcon }}>
              {children}
            </Control>
          </div>
        </div>
      </Field>
    ) :
    (
      <Field className="field">
        <Label {...{ ...labelProps, isRadio }} />
        <Control hasIcon={hasIcon}>
          {children}
        </Control>
      </Field>
    );
}

export default BoxInputFrame;

function Field({ isRadio, children, ...attributes }) {
  return (
    isRadio ?
    <fieldset {...attributes}>{children}</fieldset> :
    <div {...attributes}>{children}</div>
  );
}