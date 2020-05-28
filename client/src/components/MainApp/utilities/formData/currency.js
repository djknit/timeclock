function currencyValueStoreFactory() {
  let _value = {
    raw: '',
    rounded: null,
    display: null,
    problem: 'no-value'
  };

  return {
    getValue() {
      return { ..._value };
    },
    setValue(newRawVal, decimalDigits) {
      _value.raw = newRawVal;
      const parsedValue = parseFloat(newRawVal);
      if (!parsedValue && parsedValue !== 0) {
        _value.rounded = _value.display = null;
        _value.problem = 'no-value';
      }
      else if (parsedValue < 0) {
        _value.rounded = null;
        _value.display = 'negative';
        _value.problem = 'bad-value';
      }
      else {
        _value.display = (
          decimalDigits || decimalDigits === 0 ?
          parsedValue.toFixed(decimalDigits) :
          parsedValue
        );
        _value.rounded = parseFloat(_value.display);
        _value.problem = null;
      }
    }
  }; 
}

export { currencyValueStoreFactory };