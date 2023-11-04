import { defineStore } from 'pinia';
import { permissionsAll } from 'src/services/api/auth/permission/permission.service';
import {
  PermissionResponse,
  PermissionState,
} from 'src/services/api/auth/permission/permission.types';
import { RoleResponse } from 'src/services/api/auth/role/role.types';

export const usePermissionStore = defineStore('permission', {
  persist: true,
  state: (): PermissionState => ({
    permissionsAssigment: [],
    permissionsAll,
  }),
  getters: {
    getCodesAssigment(state: PermissionState): string[] {
      return state.permissionsAssigment.map((item) => item.code);
    },
    getCodesAll(state: PermissionState): string[] {
      return state.permissionsAll.map((item) => item.code);
    },
    getSizePermissionAssigment(state: PermissionState): number {
      return state.permissionsAssigment.length;
    },
  },
  actions: {
    havePermission(codePermission: string): boolean {
      return this.permissionsAssigment
        .map((item) => item.code)
        .includes(codePermission);
    },

    setPermissionsAssigment(rolessAssigment: RoleResponse[]): void {
      const perms: PermissionResponse[] = [];
      rolessAssigment.forEach((role) => {
        role.permissions.forEach((permission) => {
          if (perms.filter((p) => p.id == permission.id).length == 0) {
            perms.push(permission);
          }
        });
      });
      this.permissionsAssigment = perms;
    },
    setPermissionsAll(permissionsAll: PermissionResponse[]): void {
      this.permissionsAll = permissionsAll;
    },
    destroyPermisions(): void {
      this.permissionsAssigment = [];
    },
  },
});
