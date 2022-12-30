import { api } from 'src/boot/axios';
import { ResponseExternal } from 'src/common/interface/util';
import { PermisionCreateRequest, PermisionResponse, PermisionUpdateRequest } from './permisionDTO';

export async function getAllPermision(): Promise<ResponseExternal<PermisionResponse[]>> {
    return await api.get('/permits_controller');
}
export async function getByIdPermision(id: string): Promise<ResponseExternal<PermisionResponse>> {
    return await api.get(`/permits_controller/${id}`);
}
export async function createPermision(data: PermisionCreateRequest): Promise<ResponseExternal<PermisionResponse>> {
    return await api.put('/permits_controller', data);
}
export async function updatePermision(id: string, data: PermisionUpdateRequest): Promise<ResponseExternal<PermisionResponse>> {
    return await api.put(`/permits_controller/${id}`, data);
}
export async function deleteByIdPermision(id: string): Promise<ResponseExternal<null>> {
    return await api.delete(`/permits_controller/${id}`);
}