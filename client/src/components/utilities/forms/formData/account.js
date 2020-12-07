import { constants } from '../../../../utilities';
const { emailRegEx } = constants;

function getTakenUsernameDisplayMessage(username) {
  return `The username "${username}" is not available.`;
}
function getTakenEmailDisplayMessage(email) {
  return `There is already an account for the email address "${email}".`;
}

function getUsernameProblems(username, problemMessages, unavailableUsernames) {
  let hasProblem = false;
  if (username.length < 4) {
    hasProblem = true;
    problemMessages.push('Invalid username: must be at least 4 characters long.');
  }
  if (emailRegEx.test(username)) {
    hasProblem = true;
    problemMessages.push('You can\'t use an email address as a username.');
  }
  if (unavailableUsernames.includes(username)) {
    hasProblem = true;
    problemMessages.push(getTakenUsernameDisplayMessage(username));
  }
  return hasProblem ? { username: true } : null;
}

function getEmailProblems(email, problemMessages, unavailableEmails) {
  let hasProblem = false;
  if (!emailRegEx.test(email)) {
    hasProblem = true;
    problemMessages.push('The email you entered is not a valid email address.');
  }
  if (unavailableEmails.includes(email.toLowerCase())) {
    hasProblem = true;
    problemMessages.push(getTakenEmailDisplayMessage(email));
  }
  return hasProblem ? { email: true } : null;
}

function getPasswordProblems(password, problemMessages, verifyPassword) {
  let problems = {};
  if (password.length < 7) {
    problems.password = problems.verifyPassword = true;
    problemMessages.push('Invalid password: must be at least 7 characters long.');
  }
  if (!verifyPassword) {
    problems.verifyPassword = true;
    problemMessages.push('You must retype your new password to confirm it.');
  }
  else if (password !== verifyPassword) {
    problems.verifyPassword = true;
    problemMessages.push('The passwords you entered don\'t match.');
  }
  return (problems.password || problems.verifyPassword) ? problems : null;
}

function checkApiResProbMsgsForTakenUsernameOrEmail(problemMessages, inputs, takenPropValues) {
  const { username, email } = inputs;
  const takenUsernameMessage = 'That username is taken.';
  const takenEmailMessage = 'There is already an account for that email address.';
  const takenUsernameMessageIndex = problemMessages.indexOf(takenUsernameMessage);
  const takenEmailMessageIndex = problemMessages.indexOf(takenEmailMessage);
  if (takenUsernameMessageIndex !== -1) {
    problemMessages[takenUsernameMessageIndex] = getTakenUsernameDisplayMessage(username);
    takenPropValues.usernames.push(username);
  }
  if (takenEmailMessageIndex !== -1) {
    problemMessages[takenEmailMessageIndex] = getTakenEmailDisplayMessage(email);
    takenPropValues.emails.push(email);
  }
}

export {
  getUsernameProblems,
  getEmailProblems,
  getPasswordProblems,
  checkApiResProbMsgsForTakenUsernameOrEmail
};

export default {
  getEmailProblems,
  getUsernameProblems,
  getPasswordProblems,
  checkApiResProbMsgsForTakenUsernameOrEmail
};