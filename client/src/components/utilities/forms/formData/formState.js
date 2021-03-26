const genericFormStates = {
  get starting() {
    return {
      hasSuccess: false,
      hasProblem: false,
      isLoading: false,
      problems: {},
      problemMessages: [],
      showMessage: true,
      hasBeenSubmitted: false,
      secondsUntilRedirect: undefined,
      hasWarning: false,
      warningMessages: []
    };
  },
  get submissionProcessing() {
    return {
      hasBeenSubmitted: true,
      isLoading: true,
      hasProblem: false, // warning deliberately not cleared at this step
      showMessage: false,
      problems: {},
      problemMessages: []
    };
  },
  get problem() {
    return {
      hasProblem: true,
      isLoading: false,
      showMessage: true,
      hasWarning: false,
      warningMessages: []
    };
  },
  get warning() {
    return {
      isLoading: false,
      showMessage: true,
      hasWarning: true
    };
  },
  get success() {
    return {
      isLoading: false,
      hasSuccess: true,
      hasProblem: false,
      showMessage: true,
      problems: {},
      problemMessages: [],
      hasWarning: false,
      warningMessages: []
    };
  }
};

const containerRefName = 'containerRef';

export {
  genericFormStates,
  containerRefName
};
