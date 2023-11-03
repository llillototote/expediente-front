import { api } from 'src/boot/axios';
import { ResponseExternal } from 'src/common/interface/util';
import { DepartmentRequest, DepartmentResponse } from './department.types';

export async function getByIdDepartment(
  id: number
): Promise<ResponseExternal<DepartmentResponse>> {
  return await api.get(`department/${id}`);
}
export async function getAllDepartment(): Promise<
  ResponseExternal<DepartmentResponse[]>
> {
  return await api.get('department');
}
export async function updateDepartment(
  id: number,
  data: DepartmentRequest
): Promise<ResponseExternal<DepartmentResponse>> {
  return await api.put(`department/${id}`, data);
}
export async function deleteByIdDepartment(
  id: number
): Promise<ResponseExternal<null>> {
  return await api.delete(`department/${id}`);
}
export async function createDepartment(
  data: DepartmentRequest
): Promise<ResponseExternal<DepartmentResponse>> {
  return await api.post('department', data);
}
