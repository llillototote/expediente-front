import { api } from 'src/boot/axios';
import { ResponseExternal } from 'src/common/interface/util';
import { EmployeeRequest, EmployeeResponse } from './employee.types';

export async function getByIdEmployee(
  id: number
): Promise<ResponseExternal<EmployeeResponse>> {
  return await api.get(`employee/${id}`);
}
export async function getAllEmployee(): Promise<
  ResponseExternal<EmployeeResponse[]>
> {
  return await api.get('employee');
}
export async function updateEmployee(
  id: number,
  data: EmployeeRequest
): Promise<ResponseExternal<EmployeeResponse>> {
  return await api.put(`employee/${id}`, data);
}
export async function deleteByIdEmployee(
  id: number
): Promise<ResponseExternal<null>> {
  return await api.delete(`employee/${id}`);
}
export async function createEmployee(
  data: EmployeeRequest
): Promise<ResponseExternal<EmployeeResponse>> {
  return await api.post('employee', data);
}
