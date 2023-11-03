import { PermissionResponse } from '../permission/permission.types';

export interface RoleResponse {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
  permissions: PermissionResponse[];
}

export type RoleRequest = {
  name: string;
  description: string;
  permissions: number[];
};

export type RoleShortResponse = Omit<
  RoleResponse,
  'createdAt' | 'updatedAt' | 'permissions'
>;
