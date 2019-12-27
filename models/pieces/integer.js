module.exports = function intTypeFactory(options) {
  const intValidate = {
    validator: val => {
      if (options && options.validator) {
        const isValid = validator(val);
        if (!isValid) return false;
      }
      if (Math.floor(val) !== val) return false;
    },
    message: 'Must be an integer.'
  };

  const otherValidate = options && options.validate;

  return {
    type: Number,
    validate: otherValidate ? [intValidate, otherValidate] : intValidate
  };
}