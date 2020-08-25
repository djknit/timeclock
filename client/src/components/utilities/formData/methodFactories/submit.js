import { constants } from '../../constants';
import { genericFormStates } from '../formState.js';

const { secondsToDelayRedirect, stepSizeOfRedirectDelay } = constants;

function submitFactory() {
  return function(event) {
    event.preventDefault();
    let secondsUntilRedirect; 
    this.setSubmissionProcessingState()
    .then(() => {
      const { problems, problemMessages } = this.getInputProblems();
      if (problemMessages && problemMessages.length > 0) {
        throw { problems, messages: problemMessages };
      }
      const { hasWarning, warningMessages } = this.getWarnings();
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
      return this.processSuccessResponse && this.processSuccessResponse(res);
    })
    .then(() => {
      const intervalId = setInterval(
        () => {
          secondsUntilRedirect -= stepSizeOfRedirectDelay;
          this.setState({ secondsUntilRedirect });
          if (secondsUntilRedirect <= 0) {
            clearInterval(intervalId);
            if (this.afterSuccessCountdown) this.afterSuccessCountdown();
            this.reset();
          }
        },
        1000 * stepSizeOfRedirectDelay
      );
    }) 
    .catch(err => {
      const { isWarning } = err || {};
      const { catchApiUnauthorized } = this.props;
      if (catchApiUnauthorized) catchApiUnauthorized(err);
      const errorData = (err && err.response && err.response.data) || err || {};
      let { problems = {}, messages = [] } = errorData;
      const stateType = isWarning ? 'warning' : 'problem';
      let stateUpdates = {
        problemMessages: [],
        warningMessages: [],
        problems,
        ...genericFormStates[stateType]
      };
      stateUpdates[`${stateType}Messages`] = messages;
      this.setState(stateUpdates);
    })
  };
}

export { submitFactory };