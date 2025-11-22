import axios, { AxiosError, type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";

// const apiUrl:string = import.meta.env.VITE_API_URL;

const apiUrl:string = "http://localhost:5000/api/v1"

const axiosInstance:AxiosInstance = axios.create({
  baseURL: `${apiUrl}`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Request interceptor
console.log(sessionStorage.getItem("token"))
axiosInstance.interceptors.request.use(
  (config:InternalAxiosRequestConfig):InternalAxiosRequestConfig => {
    const token = sessionStorage.getItem("token");
    console.log(token);
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error:AxiosError):Promise<AxiosError> => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response:AxiosResponse):AxiosResponse => {
    return response;
  },
  (error:AxiosError):Promise<AxiosError> => {
    console.error("Response Error:", error);

    if (error.response && error.response.status === 401) {
      console.log("Unauthorized, redirecting to login...");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;