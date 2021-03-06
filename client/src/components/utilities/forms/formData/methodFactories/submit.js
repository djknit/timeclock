import { constants } from '../../../../utilities';
import { genericFormStates } from '../formState';
import { scrollTopIfShould } from './autoScroll';

const { secondsToDelayRedirect, stepSizeOfRedirectDelay } = constants;

function submitFactory(hasCountdown, scrollOptions) {

  return function (event) {
    event.preventDefault();
    let secondsUntilRedirect;
    this.setSubmissionProcessingState()
    .then(() => {
      const {
        problems, problemMessages
      } = this.getInputProblems ? this.getInputProblems() : {};
      if (problemMessages && problemMessages.length > 0) {
        throw { problems, messages: problemMessages };
      }
      const {
        hasWarning, warningMessages
      } = this.getWarnings ? this.getWarnings() : {};
      if (hasWarning) {
        throw {
          isWarning: true,
          messages: warningMessages
        };
      }
      return this.processAndSubmitData();
    })
    .then(res => {
      secondsUntilRedirect = secondsToDelayRedirect;
      this.setState({
        ...genericFormStates.success,
        secondsUntilRedirect
      });
      scrollTopIfShould('success', this, scrollOptions);
      return this.processSuccessResponse && this.processSuccessResponse(res);
    })
    .then(() => {
      if (hasCountdown === false) return;
      const intervalId = setInterval(
        () => {
          secondsUntilRedirect -= stepSizeOfRedirectDelay;
          this.setState({ secondsUntilRedirect });
          if (secondsUntilRedirect <= 0) {
            clearInterval(intervalId);
            this.reset();
            if (this.afterSuccessCountdown) this.afterSuccessCountdown();
            else this.props.closeModal();
          }
        },
        1000 * stepSizeOfRedirectDelay
      );
    })
    .catch(err => {
      if (err && err.is401) return;
      const _err = err || {};
      let { response } = _err;
      if (response && this.processErrorResponse) this.processErrorResponse(response);
      const { isWarning } = _err;
      let {
        problems = {}, messages = []
      } = (response && response.data) || _err;
      if (!isWarning && !messages.length) messages.push('An unknown problem has occured.');
      this.setState({
        problemMessages: !isWarning ? messages : [],
        warningMessages: isWarning ? messages : [],
        problems,
        ...genericFormStates[isWarning ? 'warning' : 'problem']
      });
      if (messages.length) {
        const eventName = isWarning ? 'warning' : 'problem';
        scrollTopIfShould(eventName, this, scrollOptions);
      }
    });
  };

}

export { submitFactory };
