export * from '../../utilities';
export * from './currency';
export * from './forms';
export * from './modalManagement';

function promiseToSetState(component, updatedState) {
  return new Promise(resolve => component.setState(updatedState, resolve));
}

function getColorClass(theme) {
  if (!theme) return '';
  const words = theme.split(' ');
  let className = '';
  words.forEach((word, index) => {
    if (index !== 0) className += ' ';
    className += word.includes('is-') ? word : `is-${word}`;
  });
  return className;
}

function getSizeClass(size) {
  if ((!size && size !== 0) || size === 'none') return '';
  const isNum = typeof(size) === 'number' || parseInt(size).toString() === size;
  return isNum ? `is-size-${size}` : `is-${size}`;
}

function keyTriggerCheckerFactory(handleClick) {
  return function checkForKeyTrigger(event) {
    const keyCode = event.which;
    if (keyCode === 13 || keyCode === 32) {
      handleClick();
    }
  };
}

function getClickableElAttrs(handleClick, disabled) {
  return disabled ? (
    { tabIndex: -1 }
  ) : (
    {
      tabIndex: 0,
      onClick: handleClick,
      onKeyDown: keyTriggerCheckerFactory(handleClick)
    }
  );
}

export {
  promiseToSetState,
  getColorClass,
  getSizeClass,
  keyTriggerCheckerFactory,
  getClickableElAttrs
};
