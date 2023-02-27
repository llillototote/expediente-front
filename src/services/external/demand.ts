import { api } from 'src/boot/axios';
import { ResponseExternal } from 'src/common/interface/util';
import { DemandCreateRequest, DemandFindResponse, DemandResponse, DemandUpdateRequest } from './demandDTO';

export async function getAllDemand(): Promise<ResponseExternal<DemandResponse[]>> {
    return new Promise((resolve, reject) => {
        resolve(
            {
                status: 200,
                payload: [
                    {
                        pkDem: 'nrodemandaasdads',
                        nro_demanda: 'nrodemanda',
                        fecha_solicitud: 'hoy',
                        estado: 'no aprobada',
                        importe_total: '30.00',
                    } as DemandResponse
                ]
            } as ResponseExternal<DemandResponse[]>)
    })

    //return await api.get('/rol_controller');
}
export async function getByIdDemand(id: string): Promise<ResponseExternal<DemandFindResponse>> {
    return await api.get(`/rol_controller/${id}`);
}
export async function createDemand(data: DemandCreateRequest): Promise<ResponseExternal<DemandResponse>> {
    return await api.post('/rol_controller', data);
}
export async function updateDemand(id: string, data: DemandUpdateRequest): Promise<ResponseExternal<DemandResponse>> {
    return await api.put(`/rol_controller/${id}`, data);
}
export async function deleteByIdDemand(id: string): Promise<ResponseExternal<null>> {
    return await api.delete(`/rol_controller/${id}`);
}