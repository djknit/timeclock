module.exports = function intTypeFactory(options) {
  const intValidate = {
    validator: val => {
      return (Math.floor(val) === val);
    },
    message: 'Must be an integer.'
  };

  const otherValidate = options && options.validate;

  const defaultVal = options && options.default

  return {
    type: Number,
    validate: otherValidate ? [intValidate, otherValidate] : intValidate,
    default: defaultVal,
    required: options && options.required
  };
}