import { api } from 'src/boot/axios';
import { ResponseExternal } from 'src/common/interface/util';
import { PermisionCreateRequest, PermisionResponse, PermisionUpdateRequest } from './permisionDTO';

export async function getAllPermision(): Promise<ResponseExternal<PermisionResponse[]>> {
    return await api.get('/security/permits_controller');
}
export async function getByIdPermision(id: string): Promise<ResponseExternal<PermisionResponse>> {
    return await api.get(`/security/permits_controller/${id}`);
}
export async function createPermision(data: PermisionCreateRequest): Promise<ResponseExternal<PermisionResponse>> {
    return await api.put('/security/permits_controller', data);
}
export async function updateStatusPermision(status: boolean, data: string[]): Promise<ResponseExternal<boolean>> {
    return await api.put(`/security/permits_controller/${status}`, data);
}
export async function deleteByIdPermision(id: string): Promise<ResponseExternal<null>> {
    return await api.delete(`/security/permits_controller/${id}`);
}