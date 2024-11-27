import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: "/api",
  withCredentials: true, // Ensures cookies are sent with requests
});

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    // If the response is successful, just return it
    return response;
  },
  (error) => {
    // Handle specific error cases
    if (error.code === "ERR_NETWORK") {
      console.error("Network error detected:", error.message);
      // Redirect to the offline page or show an alert
      window.location.href = "/offline";
    }

    // Check for a 401 response status
    if (error.response && error.response.status === 401) {
      // Redirect to the login page
      window.location.href = "/login";
    }

    // Otherwise, reject the promise with the error
    return Promise.reject(error);
  }
);

export default api;
