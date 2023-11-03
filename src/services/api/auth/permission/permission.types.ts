export interface PermissionResponse {
  id: number;
  createdAt: string;
  updatedAt: string;
  code: string;
  description: string;
  active: boolean;
}

export interface PermissionState {
  permissionsAssigment: PermissionResponse[];
  permissionsAll: PermissionResponse[];
}
