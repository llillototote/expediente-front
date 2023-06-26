import { api } from 'src/boot/axios';
import { ResponseExternal } from 'src/common/interface/util';
import { DataLoginBasic, LoginResponse, UserCreateRequest, UserFindedResponse, UserResponse, UserUpdateRequest } from './userDTO';


export async function login({ password, username }: DataLoginBasic): Promise<ResponseExternal<LoginResponse>> {
  return await api.post('/security/auth/login', {
    password,
    username
  } as DataLoginBasic);
}
export async function getAllUser(): Promise<ResponseExternal<UserResponse[]>> {
  return await api.get('/security/person_controller');
}
export async function getByIdUser(id: string): Promise<ResponseExternal<UserFindedResponse>> {
  return await api.get(`/security/person_controller/${id}`);
}
export async function createUser(data: UserCreateRequest): Promise<ResponseExternal<UserResponse>> {
  return await api.post('/security/person_controller', data);
}
export async function updateUser(id: string, data: UserUpdateRequest): Promise<ResponseExternal<UserResponse>> {
  return await api.put(`/security/person_controller/${id}`, data);
}
export async function deleteByIdUser(id: string): Promise<ResponseExternal<null>> {
  return await api.delete(`/security/person_controller/${id}`);
}
