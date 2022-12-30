import { route } from 'quasar/wrappers';
import { revisarPermisosRouter } from 'src/services/util';
import { useUserStore } from 'src/stores/user-store';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';

import routes from './routes';


/*
* If not building with SSR mode, you can
* directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
*/

export default route(function ({ store }) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore()
    const nameLink: string = JSON.stringify(to.name).replace(/"/g, "");
    const permisos = userStore.getProfile.listPermits
    if (permisos.length > 0) {
      if (revisarPermisosRouter(nameLink, permisos)) {

        console.log('next')
        next();
      } else {
        // console.log('estas logueado pero no puedes entrar a una ruta prohivida')
        next({ name: "forbiden" });
      }
    } else if (
      permisos.length == 0 &&
      revisarPermisosRouter(nameLink, [])
    ) {
      // console.log('no hay nadie logueado pero es una ruta publica')
      next();
    } else {
      // console.log('no hay nadie logeado y la ruta tiene permisos')
      next({ name: "error404" });
    }
  });


  return Router;
});
