import { containerRefName } from '../formState';

function scrollTopIfShould(
  eventName,
  formMgmtComp,
  {
    isOn,
    scrollToTopOn = { success: true }
  } = {}
) {
  const container = formMgmtComp[containerRefName] && formMgmtComp[containerRefName].current;
  if (container && isOn && scrollToTopOn[eventName] || scrollToTopOn.all) {
    // source (next line): 'https://stackoverflow.com/questions/10744299/scroll-back-to-the-top-of-scrollable-div#answer-20031558'
    container.animate({ scrollTop: 0 }, 'fast');
  }
}

export { scrollTopIfShould };
