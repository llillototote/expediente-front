import { api } from 'src/boot/axios';
import { ResponseExternal } from 'src/common/interface/util';
import { MatrixHouseCreateRequest, MatrixHouseResponse, MatrixHouseUpdateRequest } from './matrixHouseDTO';

export async function getAllMatrixHouse(): Promise<ResponseExternal<MatrixHouseResponse[]>> {
    return await api.get('/commercialdemand/matrix_house_controller');
}

export async function uploadListMatrixHouse(params: any): Promise<ResponseExternal<null>> {
    const requestFormData = new FormData();
    requestFormData.append('file', params.file);
    return await api.post('/nomenclator/MatrixHouse', requestFormData);
}

export async function getByIdMatrixHouse(id: string): Promise<ResponseExternal<MatrixHouseResponse>> {
    return await api.get(`/commercialdemand/matrix_house_controller/${id}`);
}
export async function createMatrixHouse(data: MatrixHouseCreateRequest): Promise<ResponseExternal<MatrixHouseResponse>> {
    return await api.post('/commercialdemand/matrix_house_controller', data);
}
export async function updateMatrixHouse(id: string, data: MatrixHouseUpdateRequest): Promise<ResponseExternal<MatrixHouseResponse>> {
    return await api.put(`/commercialdemand/matrix_house_controller/${id}`, data);
}
export async function deleteByIdMatrixHouse(id: string): Promise<ResponseExternal<null>> {
    return await api.delete(`/commercialdemand/matrix_house_controller/${id}`);
}