const valueLabel = {
  fontWeight: 500
};

export default function getStyle(additionalLabelStyle) {

  return {
    valueLabel: {
      ...valueLabel,
      ...(additionalLabelStyle || {})
    }
  };
};

export { valueLabel };