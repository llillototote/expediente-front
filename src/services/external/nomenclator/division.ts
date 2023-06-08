import { DivisionCreateRequest, DivisionResponse, DivisionShort, DivisionUpdateRequest } from './divisionDTO';
import { api } from 'src/boot/axios';
import { ResponseExternal } from 'src/common/interface/util';

export async function getAllDivision(): Promise<ResponseExternal<DivisionShort[]>> {
    return await api.get('/commercialdemand/territorial_division_controller');
}

export async function uploadListDivision(params: any): Promise<ResponseExternal<null>> {
    const requestFormData = new FormData();
    requestFormData.append('file', params.file);
    return await api.post('/nomenclator/division', requestFormData);
}
export async function getByIdDivision(id: string): Promise<ResponseExternal<DivisionResponse>> {
    return await api.get(`/commercialdemand/territorial_division_controller/${id}`);
}
export async function createDivision(data: DivisionCreateRequest): Promise<ResponseExternal<DivisionResponse>> {
    return await api.post('/commercialdemand/territorial_division_controller', data);
}
export async function updateDivision(id: string, data: DivisionUpdateRequest): Promise<ResponseExternal<DivisionResponse>> {
    return await api.put(`/commercialdemand/territorial_division_controller/${id}`, data);
}
export async function deleteByIdDivision(id: string): Promise<ResponseExternal<null>> {
    return await api.delete(`/commercialdemand/territorial_division_controller/${id}`);
}