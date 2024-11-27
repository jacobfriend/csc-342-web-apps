import HTTPClient from './HTTPClient.js';

const BASE_API_PATH = './api';

const handleAuthError = (error) => {
  if(error.status === 401) {
    document.location = './login';
  }
  throw error;
};

const logIn = (username) => {
  const data = {
    username: username
  };
  return HTTPClient.post(`${BASE_API_PATH}/users/login`, data);
};

const logOut = () => {
  return HTTPClient.post(`${BASE_API_PATH}/users/logout`, {});
};

const getCurrentUser = () => {
  return HTTPClient.get(`${BASE_API_PATH}/users/current`)
  .catch(handleAuthError);
};

const getUserProfile = (username) => {
  return HTTPClient.get(`${BASE_API_PATH}/users/${username}`)
  .catch(handleAuthError);
};

const getHowlsFromFollowedUsers = () => {
  return HTTPClient.get(`${BASE_API_PATH}/following/howls`)
  .catch(handleAuthError);
}

const getUserHowls = (username) => {
  return HTTPClient.get(`${BASE_API_PATH}/${username}/howls`)
  .catch(handleAuthError);
}

const getFollowingList = (username) => {
  return HTTPClient.get(`${BASE_API_PATH}/${username}/following`)
  .catch(handleAuthError);
}

const createHowl = (data) => {
  return HTTPClient.post(`${BASE_API_PATH}/howls`, data)
  .catch(handleAuthError);
}

const unfollowUser = (data) => {
  return HTTPClient.post(`${BASE_API_PATH}/unfollow`, data)
  .catch(handleAuthError);
}

const followUser = (data) => {
  return HTTPClient.post(`${BASE_API_PATH}/following`, data)
  .catch(handleAuthError);
}

export default {
  getCurrentUser,
  logIn,
  logOut,
  getHowlsFromFollowedUsers,
  getUserHowls,
  getFollowingList,
  getUserProfile,
  createHowl,
  followUser,
  unfollowUser
};
