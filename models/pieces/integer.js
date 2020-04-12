module.exports = function intTypeFactory(options) {
  const intValidate = {
    validator: val => {
      return (Math.floor(val) === val);
    },
    message: 'Must be an integer.'
  };

  const otherValidate = options && options.validate;

  return {
    type: Number,
    validate: otherValidate ? [intValidate, otherValidate] : intValidate,
    default: options && options.default,
    required: options && options.required
  };
}