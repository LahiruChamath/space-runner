import { jget, jpost } from './api';

export function me() {
  return jget('/api/auth/me');
}

export function login(data) {
  return jpost('/api/auth/login', data);
}

export function register(data) {
  return jpost('/api/auth/register', data);
}

export function logout() {
  return jpost('/api/auth/logout', {});
}
