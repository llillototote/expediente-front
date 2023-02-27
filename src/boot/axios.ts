import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';
import { preloadResponseExternal } from 'src/services/util';
import { useUserStore } from 'src/stores/user-store';
import { Notify } from 'quasar';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)

const SCHEMA = process.env.SCHEMA;
const BACKEND_IP = process.env.BACKEND_IP;
const BACKEND_PORT = process.env.BACKEND_PORT;

const api = axios.create({
  baseURL: `${SCHEMA}://${BACKEND_IP}:${BACKEND_PORT}/api/v1`
});

const userStore = useUserStore()
//api.defaults.headers.common['Authorization'] = `Bearer ${userStore.getProfile.token}`;
// Add a request interceptor
api.interceptors.request.use(function (config) {
  // Do something before request is sent
  //console.log(userStore.getProfile.token);
  userStore.getProfile.token != "" ? config.headers.Authorization = `Bearer ${userStore.getProfile.token}` : "";

  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
api.interceptors.response.use(function (response) {
  // Do something with response data
  //instanceOfInterface<string[]>(response.data)
  /*Notify.create({
    message: `Correcto, operación satisfactoria!`,
    textColor: 'white',
    color: 'green',
    position: 'top-right'
  })*/
  return preloadResponseExternal<unknown>(response)
}, function (error) {

  const message = `Error, ${(error.response.data) ? error.response.data.message : error.message}!`
  /*Notify.create({
    message,
    textColor: 'white',
    color: 'red',
    position: 'top-right'
  })*/
  // Do something with response error
  return preloadResponseExternal<null>(error)
});


export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api };

function instanceOfInterface<T>(data: any): data is T {
  console.log(data)
  console.log("is null", data === null)
  console.log("is array", Array.isArray(data))
  console.log("is object", typeof data === "object")

  if (!Array.isArray(data) && typeof data === "object" && data !== null) //Is Object
  {
    Object.keys(data).forEach(key => {
      console.log(key)
      console.log(key in data)

    });
  } else if (Array.isArray(data)) //Is Object
  {

    data.forEach(row => {
      instanceOfInterface<T>(row)
    });
  }
  return 'name' in data;
}
