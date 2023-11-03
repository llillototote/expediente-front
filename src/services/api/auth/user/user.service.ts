import { api } from 'src/boot/axios';
import { ResponseExternal } from 'src/common/interface/util';
import {
  LoginResponse,
  UserLoginRequest,
  UserRequest,
  UserResponse,
} from './user.types';

export async function getByIdUser(
  id: number
): Promise<ResponseExternal<UserResponse>> {
  return await api.get(`user/${id}`);
}
export async function getAllUser(): Promise<ResponseExternal<UserResponse[]>> {
  return await api.get('user');
}
export async function updateUser(
  id: number,
  data: UserRequest
): Promise<ResponseExternal<UserResponse>> {
  return await api.put(`user/${id}`, data);
}
export async function deleteByIdUser(
  id: number
): Promise<ResponseExternal<null>> {
  return await api.delete(`user/${id}`);
}
export async function createUser(
  data: UserRequest
): Promise<ResponseExternal<UserResponse>> {
  return await api.post('user', data);
}
export async function login(
  data: UserLoginRequest
): Promise<ResponseExternal<LoginResponse>> {
  return await api.post('auth', data);
}
