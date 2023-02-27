import { api } from 'src/boot/axios';
import { ResponseExternal } from 'src/common/interface/util';
import { RoleCreateRequest, RoleFindResponse, RoleResponse, RoleUpdateRequest } from './roleDTO';

export async function getAllRole(): Promise<ResponseExternal<RoleResponse[]>> {
    return await api.get('/security/rol_controller');
}
export async function getByIdRole(id: string): Promise<ResponseExternal<RoleFindResponse>> {
    return await api.get(`/security/rol_controller/${id}`);
}
export async function createRole(data: RoleCreateRequest): Promise<ResponseExternal<RoleResponse>> {
    return await api.post('/security/rol_controller', data);
}
export async function updateRole(id: string, data: RoleUpdateRequest): Promise<ResponseExternal<RoleResponse>> {
    return await api.put(`/security/rol_controller/${id}`, data);
}
export async function deleteByIdRole(id: string): Promise<ResponseExternal<null>> {
    return await api.delete(`/security/rol_controller/${id}`);
}
export async function getRolesBindindWithUserClient(): Promise<ResponseExternal<string[]>> {
    return await api.get('/security/rol_controller/bind');
}
export async function putRolesBindindWithUserClient(data: string[]): Promise<ResponseExternal<string[]>> {
    return await api.put('/security/rol_controller/bind', data);
}