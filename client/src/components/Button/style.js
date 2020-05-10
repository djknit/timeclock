export default function getStyle(additionalStyle, isFocused) {
  const shadowBlur = isFocused ? '3px' : '7px';

  return {
    button: Object.assign(
      {
        boxShadow: `0 0 ${shadowBlur} #202020`,
        display: 'inline-block'
      },
      additionalStyle
    )
  };
};

export * from '../../AppStyle';