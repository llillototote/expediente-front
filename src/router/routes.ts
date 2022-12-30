import { RouteRecordRaw } from 'vue-router';
// animations: [fadeInDown, slideInUp, fadeInUp, fadeInRight, fadeInLeft ]
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'access',
    component: () => import('layouts/AccessLayout.vue'),
    children: [
      {
        path: '',
        name: 'login',
        component: () => import('pages/access/login.vue'),
        meta: { transition_enter: 'animated fadeInRight', transition_leave: 'animated fadeOut' }
      },
      {
        path: '/signup',
        name: 'register',
        component: () => import('pages/access/register.vue'),
        meta: { transition_enter: 'animated fadeInLeft', transition_leave: 'animated fadeOut' }
      },
    ],
  },
  {
    path: '/app',
    component: () => import('layouts/MainLayout.vue'),
    children: [{
      path: '',
      name: 'app', component: () => import('pages/app/home/index.vue')
    },
    { path: 'role', name: 'role_list', component: () => import('pages/app/security/role/index.vue') },
    {
      path: 'role/write',
      name: 'role_write',
      component: () => import('pages/app/security/role/add_edit.vue')
    },
    { path: 'user', name: 'user_list', component: () => import('pages/app/security/user/index.vue') },
    {
      path: 'user/write',
      name: 'user_write',
      component: () => import('pages/app/security/user/add_edit.vue')
    }, { path: 'permision', name: 'permision_list', component: () => import('pages/app/security/permision/index.vue') },
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
