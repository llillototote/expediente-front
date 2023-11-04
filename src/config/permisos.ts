import { NAMESROUTES, PermisionsRoutesApp } from 'src/config/permisionDTO';

export const permisionsRoutesApp: PermisionsRoutesApp[] = [
  {
    routename: NAMESROUTES.APP_ROLE_LIST,
    dependencies: ['ALL_ROLE'],
  },
  {
    routename: NAMESROUTES.APP_USER_LIST,
    dependencies: ['ALL_USER'],
  },
  {
    routename: NAMESROUTES.APP_PERMISSION_LIST,
    dependencies: ['ALL_PERMISSION'],
  },
  {
    routename: NAMESROUTES.APP_DEPARTMENT_LIST,
    dependencies: ['ALL_DEPARTMENT'],
  },
  {
    routename: NAMESROUTES.APP_POSITION_LIST,
    dependencies: ['ALL_POSITION'],
  },
  {
    routename: NAMESROUTES.APP_EMPLOYEE_LIST,
    dependencies: ['ALL_EMPLOYEE'],
  },
  {
    routename: NAMESROUTES.APP_RECORD_LIST,
    dependencies: ['ALL_RECORD'],
  },
  {
    routename: NAMESROUTES.APP_DOCUMENT_LIST,
    dependencies: ['ALL_DOCUMENT'],
  },
];
