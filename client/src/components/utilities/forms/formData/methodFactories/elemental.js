import { containerRefName } from '../formState';

function scrollTopIfShould(
  eventName,
  formMgmtComp,
  {
    isOn: isAutoScrollOn = true,
    scrollToTopOn = { success: true }
  } = {}
) {

  const container = formMgmtComp[containerRefName] && formMgmtComp[containerRefName].current;

  if (container && isAutoScrollOn && (scrollToTopOn[eventName] || scrollToTopOn.all)) {
    container.scroll({ top: 0, behavior: 'smooth' });
  }
}

export { scrollTopIfShould };
