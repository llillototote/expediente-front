import { NAMESROUTES } from 'src/services/external/permisionDTO';
import { RouteRecordRaw } from 'vue-router';
// animations: [fadeInDown, slideInUp, fadeInUp, fadeInRight, fadeInLeft ]
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/AccessLayout.vue'),
    children: [
      {
        path: '',
        name: NAMESROUTES.LOGIN,
        component: () => import('pages/access/login.vue'),
        meta: { transition_enter: 'animated fadeInRight', transition_leave: 'animated fadeOut' }
      }/*,
      {
        path: '/signup',
        name: NAMESROUTES.REGISTER,
        component: () => import('pages/access/register.vue'),
        meta: { transition_enter: 'animated fadeInLeft', transition_leave: 'animated fadeOut' }
      },*/
    ],
  },
  {
    path: '/app',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: NAMESROUTES.APP_HOME,
        component: () => import('pages/app/home/index.vue')
      },
      {
        path: 'role',
        name: NAMESROUTES.APP_ROLE_LIST,
        component: () => import('pages/app/security/role/index.vue')
      },
      {
        path: 'role/write',
        name: NAMESROUTES.APP_ROLE_WRITE,
        component: () => import('pages/app/security/role/add_edit.vue')
      },
      {
        path: 'user',
        name: NAMESROUTES.APP_USER_LIST,
        component: () => import('pages/app/security/user/index.vue')
      },
      {
        path: 'user/write',
        name: NAMESROUTES.APP_USER_WRITE,
        component: () => import('pages/app/security/user/add_edit.vue')
      },
      {
        path: 'permision',
        name: NAMESROUTES.APP_PERMISION_LIST,
        component: () => import('pages/app/security/permision/index.vue')
      },
      //CLIENTES Y PRODUCTOS DE COPEXTEL
      {
        path: 'client',
        name: NAMESROUTES.APP_CLIENT_LIST,
        component: () => import('pages/app/demand/client/index.vue')
      },
      {
        path: 'client/write',
        name: NAMESROUTES.APP_CLIENT_WRITE,
        component: () => import('pages/app/demand/client/add_edit.vue')
      },
      {
        path: 'product',
        name: NAMESROUTES.APP_PRODUCT_LIST,
        component: () => import('pages/app/demand/product/index.vue')
      },
      {
        path: 'product/write',
        name: NAMESROUTES.APP_PRODUCT_WRITE,
        component: () => import('pages/app/demand/product/add_edit.vue')
      },
    ],
  },


  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    name: 'error404',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
