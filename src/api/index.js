import ajax from './ajax'
export const reqLogin = (username, password) =>
  ajax("/login", { username, password }, "POST");