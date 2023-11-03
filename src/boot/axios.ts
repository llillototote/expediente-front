import { useAxiosRefreshStore } from 'src/stores/axiosrefresh-store';
import { useUserStore } from 'src/stores/user-store';
import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';
import { preloadResponseExternal } from 'src/services/util';
import { ResponseExternal } from 'src/common/interface/util';

import { RefreshResponse } from 'src/services/api/auth/user/user.types';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

const SCHEMA = process.env.SCHEMA;
const BACKEND_IP = process.env.BACKEND_IP;
const BACKEND_PORT = process.env.BACKEND_PORT;

const api: AxiosInstance = axios.create({
  baseURL: `${SCHEMA}://${BACKEND_IP}:${BACKEND_PORT}/`,
});

const apiDownload = axios.create({
  baseURL: `${SCHEMA}://${BACKEND_IP}:${BACKEND_PORT}/`,
});

const URL_REFRESH = '/auth/refresh';

api.interceptors.request.use(
  function (config) {
    const axiosRefreshStore = useAxiosRefreshStore();
    const userStore = useUserStore();

    userStore.access_token != ''
      ? (config.headers.Authorization = `Bearer ${userStore.access_token}`)
      : '';

    if (userStore.isLoggedIn) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${
          config.url === URL_REFRESH
            ? userStore.refresh_token
            : userStore.access_token
        }`,
      };
    }

    // Guardar la penultima configuracion de request
    axiosRefreshStore.setPreLastConfig(axiosRefreshStore.getLastConfig);
    // Guardar la ultima configuracion de request
    axiosRefreshStore.setLastConfig(config);

    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

apiDownload.interceptors.request.use(
  function (config) {
    const userStore = useUserStore();

    userStore.access_token != ''
      ? (config.headers.Authorization = `Bearer ${userStore.access_token}`)
      : '';

    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  function (response) {
    const axiosRefreshStore = useAxiosRefreshStore();
    axiosRefreshStore.resetRetry();
    return preloadResponseExternal<unknown>(response);
  },
  async function (error) {
    const axiosRefreshStore = useAxiosRefreshStore();
    const userStore = useUserStore();

    // Do something with response error

    const resp = preloadResponseExternal<null>(error);

    if (resp.status == 401) {
      if (axiosRefreshStore.canRetry) {
        // Ya se acabo el maximo de intentos por error 401
        //redirect al login
        //useRouter().push({ name: NAMESROUTES.LOGIN });
        return resp;
      }

      // El code fue 401 asi q hay q revisar si se vencio el token y refresh

      if (userStore.isLoggedIn) {
        // el usuario esta logueado
        axiosRefreshStore.incrementRetry();
        // refrescar el accessToken
        const statusRefresh: ResponseExternal<RefreshResponse> = await api.get(
          URL_REFRESH
        );
        if (statusRefresh.status === 403) {
          // fallo del refresh, no se hace mas nada
          //redirect al login
          //useRouter().push({ name: NAMESROUTES.LOGIN });
          return resp;
        } else {
          // setear el nuevo access key en el state
          axiosRefreshStore.resetRetry();
          if (statusRefresh.payload?.access_token)
            userStore.setAccessToken(statusRefresh.payload.access_token);
        }
        // reintentar el ultimo request
        return await api(axiosRefreshStore.getPreLastConfig);
      } else {
        console.log('intento de acceder a una ruta protegida');
      }
    }

    return resp;
  }
);

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api, apiDownload };
