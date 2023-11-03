import { api } from 'src/boot/axios';
import { ResponseExternal } from 'src/common/interface/util';
import { RoleRequest, RoleResponse } from './role.types';

export async function getByIdRole(
  id: number
): Promise<ResponseExternal<RoleResponse>> {
  return await api.get(`role/${id}`);
}
export async function getAllRole(): Promise<ResponseExternal<RoleResponse[]>> {
  return await api.get('role');
}
export async function updateRole(
  id: number,
  data: RoleRequest
): Promise<ResponseExternal<RoleResponse>> {
  return await api.put(`role/${id}`, data);
}
export async function deleteByIdRole(
  id: number
): Promise<ResponseExternal<null>> {
  return await api.delete(`role/${id}`);
}
export async function createRole(
  data: RoleRequest
): Promise<ResponseExternal<RoleResponse>> {
  return await api.post('role', data);
}
