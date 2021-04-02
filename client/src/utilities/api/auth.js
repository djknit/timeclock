import { createAxiosInstance } from './elemental';
import { catchApiUnauthorized } from './catchUnauth';

const authAxios = createAxiosInstance('auth');

const methodsNotExpectingLoggedIn = {
  login({ usernameOrEmail, password }) {
    return authAxios.post('/login', { usernameOrEmail, password });
  },
  createAccount(newUser) {
    return authAxios.post('/create-account', newUser);
  },
  test(shouldBeAuthorized = true) {
    return (
      authAxios.get('/test')
      .catch(err => {
        if (shouldBeAuthorized) return catchApiUnauthorized(err);
        throw err;
      })
    );
  }
};

const authApi = {
  logout() {
    return authAxios.post('/logout');
  },
  deleteAccount({ password }) {
    return authAxios.post('/delete-account', { password });
  },
  editInfo({ password, updatedProps }) {
    return authAxios.post('/edit-info', { password, updatedProps });
  }
};

export default authApi;

export { methodsNotExpectingLoggedIn };