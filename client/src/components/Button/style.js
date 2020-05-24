import { shadow } from '../../AppStyle';

export default function getStyle(additionalStyle, isFocused) {
  const shadowBlur = isFocused ? 3 : 7;

  return {
    button: {
      ...shadow(shadowBlur, undefined, '#000000'),
      display: 'inline-block',
      ...additionalStyle
    }
  };
};

export * from '../../AppStyle';