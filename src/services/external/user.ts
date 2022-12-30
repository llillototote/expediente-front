import { api } from 'src/boot/axios';
import { ResponseExternal } from 'src/common/interface/util';
import { DataLoginBasic, LoginRequest, LoginResponse, UserCreateRequest, UserFindedResponse, UserResponse, UserUpdateRequest } from './userDTO';

export async function register() {
  const data = {
    role: 'ADMIN_ROLE',
    secret: 'clave',
    username: 'usuario2',
  };
  const resp = await api.post('/auth/user/register', data);
  console.log(resp);
}

export async function login({ password, username }: DataLoginBasic): Promise<ResponseExternal<LoginResponse>> {
  return await api.post('/auth/login', {
    authLocal: true,
    password,
    username
  } as LoginRequest);
}
export async function getAllUser(): Promise<ResponseExternal<UserResponse[]>> {
  return await api.get('/person_controller');
}
export async function getByIdUser(id: string): Promise<ResponseExternal<UserFindedResponse>> {
  return await api.get(`/person_controller/${id}`);
}
export async function createUser(data: UserCreateRequest): Promise<ResponseExternal<UserResponse>> {
  return await api.put('/person_controller', data);
}
export async function updateUser(id: string, data: UserUpdateRequest): Promise<ResponseExternal<UserResponse>> {
  return await api.put(`/person_controller/${id}`, data);
}
export async function deleteByIdUser(id: string): Promise<ResponseExternal<null>> {
  return await api.delete(`/person_controller/${id}`);
}
