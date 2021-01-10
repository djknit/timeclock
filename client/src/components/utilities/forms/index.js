export * from './formData';

function getInputId(formId, propName, sectionName) {
  let inputId = sectionName ? `${sectionName}-` : '';
  inputId += `${propName}-input-${formId}`;
  return inputId;
}

export { getInputId };
