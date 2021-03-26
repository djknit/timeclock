import { containerRefName } from '../formState';

function scrollTopIfShould(
  eventName,
  formMgmtComp,
  {
    isOn: isAutoScrollOn = true,
    scrollToTopOn: {
      success = true,
      warning = true,
      problem = true,
      ...restScrollTopOn
    } = {},
    isSmooth = true
  } = {}
) {

  const scrollToTopOn = { ...restScrollTopOn, success, warning, problem };

  const container = formMgmtComp[containerRefName] && formMgmtComp[containerRefName].current;

  if (
    container &&
    isAutoScrollOn &&
    (scrollToTopOn[eventName] || scrollToTopOn.all)
  ) {
    container.scroll({
      top: 0,
      behavior: isSmooth ? 'smooth' : undefined
    });
  }
}

export { scrollTopIfShould };
