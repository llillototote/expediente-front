import { api } from 'src/boot/axios';
import { ResponseExternal } from 'src/common/interface/util';
import { UserClientCreateRequest, UserClientFindResponse, UserClientResponse, UserClientUpdateRequest } from './userClientDTO';

export async function getAllUserClient(): Promise<ResponseExternal<UserClientResponse[]>> {
  return await api.get('/security/user_client_controller');
}
export async function getByIdUserClient(id: string): Promise<ResponseExternal<UserClientFindResponse>> {
  return await api.get(`/security/user_client_controller/${id}`);
}
export async function createUserClient(data: UserClientCreateRequest): Promise<ResponseExternal<UserClientResponse>> {
  return await api.put('/security/user_client_controller', data);
}
export async function updateUserClient(id: string, data: UserClientUpdateRequest): Promise<ResponseExternal<UserClientResponse>> {
  return await api.put(`/security/user_client_controller/${id}`, data);
}
export async function deleteByIdUserClient(id: string): Promise<ResponseExternal<null>> {
  return await api.delete(`/security/user_client_controller/${id}`);
}
