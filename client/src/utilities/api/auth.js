import { createAxiosInstance } from './elemental';

const authAxios = createAxiosInstance('auth');

const authApi = {
  login({ usernameOrEmail, password }) {
    return authAxios.post('/login', { usernameOrEmail, password });
  },
  createAccount(newUser) {
    return authAxios.post('/create-account', newUser);
  },
  logout() {
    return authAxios.post('/logout');
  },
  deleteAccount({ password }) {
    return authAxios.post('/delete-account', { password });
  },
  editInfo({ password, updatedProps }) {
    return authAxios.post('/edit-info', { password, updatedProps });
  },
  test() {
    return authAxios.get('/test');
  }
};

export default authApi;