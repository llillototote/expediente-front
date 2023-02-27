import { api } from 'src/boot/axios';
import { ResponseExternal } from 'src/common/interface/util';
import { UserClientCreateRequest, UserClientResponse, UserClientUpdateRequest } from './userClientDTO';
import { DataLoginBasic, LoginResponse } from './userDTO';

export async function register() {
  const data = {
    role: 'ADMIN_ROLE',
    secret: 'clave',
    username: 'usuario2',
  };
  const resp = await api.post('/security/auth/user/register', data);
  console.log(resp);
}

export async function login({ password, username }: DataLoginBasic): Promise<ResponseExternal<LoginResponse>> {
  return await api.post('/security/auth/login', {
    password,
    username
  } as DataLoginBasic);
}
export async function getAllUserClient(): Promise<ResponseExternal<UserClientResponse[]>> {
  return await api.get('/security/user_controller');
}

export async function getByIdUserClient(id: string): Promise<ResponseExternal<UserClientResponse>> {
  return await api.get(`/security/user_controller/${id}`);
}
export async function createUserClient(data: UserClientCreateRequest): Promise<ResponseExternal<UserClientResponse>> {
  return await api.put('/security/user_controller', data);
}
export async function updateUserClient(id: string, data: UserClientUpdateRequest): Promise<ResponseExternal<UserClientResponse>> {
  return await api.put(`/security/user_controller/${id}`, data);
}
export async function deleteByIdUserClient(id: string): Promise<ResponseExternal<null>> {
  return await api.delete(`/security/user_controller/${id}`);
}
