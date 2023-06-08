import { api } from 'src/boot/axios';
import { ResponseExternal } from 'src/common/interface/util';
import { CompanyCreateRequest, CompanyResponse, CompanyUpdateRequest } from './companyDTO';

export async function getAllCompany(): Promise<ResponseExternal<CompanyResponse[]>> {
    return await api.get('/commercialdemand/company_controller');
}

export async function uploadListCompany(params: any): Promise<ResponseExternal<null>> {
    const requestFormData = new FormData();
    requestFormData.append('file', params.file);
    return await api.post('/commercialdemand/pdf-static-file/uploadscompanys', requestFormData);
}

export async function getByIdCompany(id: string): Promise<ResponseExternal<CompanyResponse>> {
    return await api.get(`/commercialdemand/company_controller/${id}`);
}
export async function createCompany(data: CompanyCreateRequest): Promise<ResponseExternal<CompanyResponse>> {
    return await api.post('/commercialdemand/company_controller', data);
}
export async function updateCompany(id: string, data: CompanyUpdateRequest): Promise<ResponseExternal<CompanyResponse>> {
    return await api.put(`/commercialdemand/company_controller/${id}`, data);
}
export async function deleteByIdCompany(id: string): Promise<ResponseExternal<null>> {
    return await api.delete(`/commercialdemand/company_controller/${id}`);
}