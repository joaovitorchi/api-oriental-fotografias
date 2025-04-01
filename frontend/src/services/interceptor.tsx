import { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import HttpService from "./http.service";

interface SetupAxiosInterceptorsOptions {
  onUnauthenticated: () => void;
}

export const setupAxiosInterceptors = ({ onUnauthenticated }: SetupAxiosInterceptorsOptions) => {
  const onRequestSuccess = async (config: InternalAxiosRequestConfig<any>) => {
    const token = localStorage.getItem("token");
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  };

  const onRequestFail = (error: any) => Promise.reject(error);

  HttpService.addRequestInterceptor(onRequestSuccess, onRequestFail);

  const onResponseSuccess = (response: AxiosResponse) => response;

  const onResponseFail = (error: any) => {
    const status = error.status || error.response.status;
    if (status === 403 || status === 401) {
      onUnauthenticated();
    }

    return Promise.reject(error);
  };

  HttpService.addResponseInterceptor(onResponseSuccess, onResponseFail);
};
