import axios from "axios";

const publicApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
});

const privateApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
});


// const privateAxios = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
//   withCredentials: true,
  
// });


privateApi.interceptors.request.use(
  (config) => {
    console.log(`request`);
    const accessToken = localStorage.getItem('token');;
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export {publicApi, privateApi}
