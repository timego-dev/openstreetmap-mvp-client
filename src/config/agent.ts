import axios from "axios";
import { BACKEND_URL } from "../constants/config";

const instance = axios.create({
  baseURL: BACKEND_URL,
});

instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

export default instance;
