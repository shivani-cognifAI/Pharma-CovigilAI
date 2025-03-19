import axios from 'axios';
import { LocalStorage } from '../../utils/localstorage';
import { CONSTANTS } from './constants';
import Toast from './Toast';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Access-Control-Allow-Origin': '*',
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = LocalStorage.getItem(
      CONSTANTS.LOCAL_STORAGE_KEYS.TOKEN
    );
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    } else {
      delete config.headers['Authorization'];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    if (error.response && error.response.status === 422) {
      Toast(' Unprocessable Entity ', { type: 'error' });
    } else if (error.response && error.response.status === 401) {
      Toast('Unauthorized request', { type: 'error' });
      LocalStorage.clearLocalStorage();
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } else if (error.response && error.response.status === 403) {
      // LocalStorage.clearLocalStorage();
    } else if (error.response && error.response.status === 500) {
      Toast('Something_Wrong', { type: 'error' });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
