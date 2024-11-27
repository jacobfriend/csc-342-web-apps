import HTTPClient from './HTTPClient.js';

const getCounties = () => {
  return HTTPClient.get('/api/counties')
    .then((counties) => {
      return new Promise((resolve, reject) => {
        resolve(counties);
      });
  });
};

const getCountyById = (countyId) => {
  return HTTPClient.get(`/api/counties/${countyId}`)
    .then((county) => {
      return new Promise((resolve, reject) => {
        if (county) {
          resolve(county);
        }
        else {
          reject();
        }
      });
  });
};

const getParksByCountyId = (countyId) => {
  return HTTPClient.get(`/api/counties/${countyId}/parks`).then((parks) => {
    return new Promise((resolve, reject) => {
      resolve(parks);
    });
  });
};

const getParkById = (parkId) => {
  return HTTPClient.get(`/api/parks/${parkId}`).then((park) => {
    return new Promise((resolve, reject) => {
      resolve(park);
    });
  });
};

export default {
  getCounties,
  getCountyById,
  getParksByCountyId,
  getParkById
};
