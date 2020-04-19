const intSubdocFactory = require('./integer');

module.exports = (useDefault) => {
  const options = useDefault !== false ? { default: 0 } : { required: true };
  return intSubdocFactory({
    validate: {
      validator(value) {
        if (value < -43200000 || value > 43200000) return false;
        return true;
      },
      message: 'Invalid day cutoff. Must be between -12 hours and 12 hours.'
    },
    ...options
  });
};