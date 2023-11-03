import { NAMESROUTES } from 'src/config/permisionDTO';
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
        meta: {
          transition_enter: 'animated fadeInRight',
          transition_leave: 'animated fadeOut',
        },
      },
    ],
  },
  {
    path: '/app',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: NAMESROUTES.APP_HOME,
        component: () => import('pages/app/home/index.vue'),
        meta: {
          transition_enter: 'animated fadeInRight',
          transition_leave: 'animated fadeOut',
        },
      },
      {
        path: 'user',
        name: NAMESROUTES.APP_USER_LIST,
        component: () => import('pages/app/security/user/index.vue'),
        meta: {
          transition_enter: 'animated fadeInRight',
          transition_leave: 'animated fadeOut',
        },
      },
      {
        path: 'user/write',
        name: NAMESROUTES.APP_USER_WRITE,
        component: () => import('pages/app/security/user/add_edit.vue'),
        meta: {
          transition_enter: 'animated fadeInRight',
          transition_leave: 'animated fadeOut',
        },
      },
      {
        path: 'role',
        name: NAMESROUTES.APP_ROLE_LIST,
        component: () => import('pages/app/security/role/index.vue'),
        meta: {
          transition_enter: 'animated fadeInRight',
          transition_leave: 'animated fadeOut',
        },
      },
      {
        path: 'role/write',
        name: NAMESROUTES.APP_ROLE_WRITE,
        component: () => import('pages/app/security/role/add_edit.vue'),
        meta: {
          transition_enter: 'animated fadeInRight',
          transition_leave: 'animated fadeOut',
        },
      },
      {
        path: 'permission',
        name: NAMESROUTES.APP_PERMISSION_LIST,
        component: () => import('pages/app/security/permission/index.vue'),
        meta: {
          transition_enter: 'animated fadeInRight',
          transition_leave: 'animated fadeOut',
        },
      },
      {
        path: 'permission/write',
        name: NAMESROUTES.APP_PERMISSION_LIST,
        component: () => import('pages/app/security/permission/add_edit.vue'),
        meta: {
          transition_enter: 'animated fadeInRight',
          transition_leave: 'animated fadeOut',
        },
      },
      {
        path: 'department',
        name: NAMESROUTES.APP_DEPARTMENT_LIST,
        component: () => import('pages/app/department/index.vue'),
        meta: {
          transition_enter: 'animated fadeInRight',
          transition_leave: 'animated fadeOut',
        },
      },
      {
        path: 'department/write',
        name: NAMESROUTES.APP_DEPARTMENT_WRITE,
        component: () => import('pages/app/department/add_edit.vue'),
        meta: {
          transition_enter: 'animated fadeInRight',
          transition_leave: 'animated fadeOut',
        },
      },
      {
        path: 'position',
        name: NAMESROUTES.APP_POSITION_LIST,
        component: () => import('pages/app/position/index.vue'),
        meta: {
          transition_enter: 'animated fadeInRight',
          transition_leave: 'animated fadeOut',
        },
      },
      {
        path: 'position/write',
        name: NAMESROUTES.APP_POSITION_WRITE,
        component: () => import('pages/app/position/add_edit.vue'),
        meta: {
          transition_enter: 'animated fadeInRight',
          transition_leave: 'animated fadeOut',
        },
      },
      {
        path: 'employee',
        name: NAMESROUTES.APP_EMPLOYEE_LIST,
        component: () => import('pages/app/employee/index.vue'),
        meta: {
          transition_enter: 'animated fadeInRight',
          transition_leave: 'animated fadeOut',
        },
      },
      {
        path: 'employee/write',
        name: NAMESROUTES.APP_EMPLOYEE_WRITE,
        component: () => import('pages/app/employee/add_edit.vue'),
        meta: {
          transition_enter: 'animated fadeInRight',
          transition_leave: 'animated fadeOut',
        },
      },
      {
        path: 'record',
        name: NAMESROUTES.APP_RECORD_LIST,
        component: () => import('pages/app/record/index.vue'),
        meta: {
          transition_enter: 'animated fadeInRight',
          transition_leave: 'animated fadeOut',
        },
      },
      {
        path: 'record/write',
        name: NAMESROUTES.APP_RECORD_WRITE,
        component: () => import('pages/app/record/add_edit.vue'),
        meta: {
          transition_enter: 'animated fadeInRight',
          transition_leave: 'animated fadeOut',
        },
      },
      {
        path: 'document',
        name: NAMESROUTES.APP_DOCUEMNT_LIST,
        component: () => import('pages/app/document/index.vue'),
        meta: {
          transition_enter: 'animated fadeInRight',
          transition_leave: 'animated fadeOut',
        },
      },
      {
        path: 'document/write',
        name: NAMESROUTES.APP_DOCUEMNT_WRITE,
        component: () => import('pages/app/document/add_edit.vue'),
        meta: {
          transition_enter: 'animated fadeInRight',
          transition_leave: 'animated fadeOut',
        },
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
