import axios, { AxiosError } from 'axios';
import { parseCookies, setCookie } from 'nookies';
import { signOut } from '../contexts/AuthContext';
type headersType = {
  Authorization: string;
} 
type ErrorAxios = {
  code: string;
  error: boolean;
  message: string;
}

type FailedRequestsQueue = {
  onSuccess: (token: string) => void;
  onFailure: (err: AxiosError) => void;
}

let cookies = parseCookies()
let isRefreshing = false;
let failedRequestsQueue = Array<FailedRequestsQueue>();

export const api = axios.create({
  baseURL: 'http://localhost:3333/',
  headers: {
    Authorization: `Bearer ${cookies['nextauth.token']}`
  }
})

api.interceptors.response.use(response => {
  return response;
}, (error: AxiosError<ErrorAxios>) => {
  if(error.response?.status === 401){
    if(error.response?.data.code === 'token.expired'){
      console.log(error.response?.data.code)
      cookies = parseCookies();
      const { 'nextauth.refreshToken': refreshToken} = cookies;
      console.log(refreshToken)
      const originalConfig = error.config

      if(!isRefreshing){
        isRefreshing = true;

        api.post('/refresh', {
          refreshToken,
        }).then(response => {
          const { token } = response?.data
          console.log(token)
  
          setCookie(undefined, 'nextauth.token', token, {
            maxAge: 60 * 60 * 24 * 30,
            path: '/',
          })
          setCookie(undefined, 'nextauth.refreshToken', response.data.refreshToken, {
            maxAge: 60 * 60 * 24 * 30,
            path: '/',
          })
          
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          console.log(failedRequestsQueue);
          failedRequestsQueue.forEach(request => {
            console.log("foi")
            request.onSuccess(token)
          })
          failedRequestsQueue = [];
    
        }).catch(err => { 
          failedRequestsQueue.forEach(request => request.onFailure(err))
          failedRequestsQueue = [];
        }).finally(() => {
          isRefreshing = false;
        })
      }

      return new Promise((resolve, reject) => {
        failedRequestsQueue.push({
          onSuccess: (token: string) => {
            if(!!originalConfig?.headers?.Authorization){
              console.log(originalConfig)
              console.log("sim");
              originalConfig.headers['Authorization'] = `Bearer ${token}`;

              resolve(api(originalConfig));
            }
          },
          onFailure: (err: AxiosError) => {
            reject(err);
          },
        })
      })
    } else {
      
     if(!!cookies['nextauth.token']){
      signOut();
     }
      
    }
  }

  return Promise.reject(error);
})