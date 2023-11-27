import axios from "axios";
import ApiService from "./apiService";

const instance = axios.create({
  baseURL: "http://localhost:8080/",
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = ApiService.getLocalAccessToken();

    if (token) {
      config.headers["x-access-token"] = token;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = await err.config;

    if (originalConfig.url !== "/api/user/login" && err.response) {
      // Access Token was expired

      try {
        if (err.response.status === 401 && !originalConfig._retry) {
          originalConfig._retry = true;
          const rs = await instance.post("/api/user/refreshToken", {
            refreshToken: ApiService.getLocalRefreshToken(),
          });

          const { accessToken } = rs.data;
          ApiService.updateLocalAccessToken(accessToken);
          return instance(originalConfig);
        }
      } catch (_error) {
        return Promise.reject(_error);
      }
    }

    return Promise.reject(err);
  }
);

export default instance;
