import axios from "axios"
import type {AxiosInstance, AxiosPromise} from "axios"


export default class HttpServices {
  private readonly BASE_URL = import.meta.env.VITE_APP_BASE_URL

  private axios(): AxiosInstance {
    const axiosInstance = axios.create()
    axiosInstance.interceptors.request.use(config => {
      config.baseURL = this.BASE_URL;
      return config;
    })
    return axiosInstance
  }

  public async list<T>(url: string): AxiosPromise<T> {
    return await this.axios().get(url);
  }

  public async create(url: string): AxiosPromise {
    return await this.axios().post(url)
  }
}
