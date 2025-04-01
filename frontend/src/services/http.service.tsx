import Axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";

const API_URL = process.env.REACT_APP_API_URL;
Axios.defaults.baseURL = API_URL;

class HttpService {
  private _axios = Axios.create();

  addRequestInterceptor = (
    onFulfilled: (
      config: InternalAxiosRequestConfig<any>
    ) => InternalAxiosRequestConfig<any> | Promise<InternalAxiosRequestConfig<any>>,
    onRejected: (error: any) => any
  ) => {
    this._axios.interceptors.request.use(onFulfilled, onRejected);
  };

  addResponseInterceptor = (
    onFulfilled: (response: AxiosResponse) => AxiosResponse,
    onRejected: (error: any) => any
  ) => {
    this._axios.interceptors.response.use(onFulfilled, onRejected);
  };

  get = async (url: string): Promise<any> => await this.request(this.getOptionsConfig("get", url));

  post = async (url: string, data: any = {}): Promise<any> =>
    await this.request(this.getOptionsConfig("post", url, data));

  put = async (url: string, data: any): Promise<any> =>
    await this.request(this.getOptionsConfig("put", url, data));

  patch = async (url: string, data: any): Promise<any> =>
    await this.request(this.getOptionsConfig("patch", url, data));

  delete = async (url: string): Promise<any> =>
    await this.request(this.getOptionsConfig("delete", url));

  getOptionsConfig = (method: string, url: string, data?: any): AxiosRequestConfig => {
    return {
      method,
      url,
      data,
      headers: {
        "Content-Type": "application/vnd.api+json",
        Accept: "application/vnd.api+json",
        "Access-Control-Allow-Credentials": true,
      },
    };
  };

  request(options: AxiosRequestConfig): Promise<any> {
    return new Promise((resolve, reject) => {
      this._axios
        .request(options)
        .then((res: AxiosResponse) => {
          if (res.status >= 200 && res.status < 300) {
            resolve(res.data);
          } else {
            reject(res.data);
          }
        })
        .catch((ex: any) => {
          if (ex.response) {
            reject(ex.response.data);
          } else {
            reject(ex);
          }
        });
    });
  }
}

export default new HttpService();
