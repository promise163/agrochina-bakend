import axios, {AxiosInstance, AxiosError, AxiosResponse, AxiosRequestConfig} from 'axios';
import {showLoading,hideLoading} from './loading'

const service:AxiosInstance = axios.create({
    baseURL:import.meta.env.VITE_APP_BASE_API,
    timeout: 15000
});

service.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        showLoading()
        if(config.url?.indexOf('login') == -1){
            config.headers.token = localStorage.getItem('token')?localStorage.getItem('token'):''
        }
        
        return config;
    },
    (error: AxiosError) => {
        console.log(error);
        return Promise.reject();
    }
);

service.interceptors.response.use(
    (response: AxiosResponse) => {
        hideLoading()
        if (response.status === 200) {
            return response;
        } else {
            Promise.reject();
        }
    },
    (error: AxiosError) => {
        hideLoading()
        console.log(error);
        return Promise.reject();
    }
);



export default service;
