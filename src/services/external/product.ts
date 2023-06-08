import { api } from 'src/boot/axios';
import { ResponseExternal } from 'src/common/interface/util';
import { ClasifProductRequest, ProductCreateRequest, ProductResponse, ProductUpdateRequest } from './productDTO';

export async function uploadListProduct(params: any): Promise<ResponseExternal<null>> {
    const requestFormData = new FormData();
    requestFormData.append('file', params.file);
    return await api.post('/commercialdemand/pdf-static-file/uploadsproducts', requestFormData);
}

export async function getAllProduct(): Promise<ResponseExternal<ProductResponse[]>> {
    return await api.get('/commercialdemand/product_controller');
}
export async function getByIdProduct(id: string): Promise<ResponseExternal<ProductResponse>> {
    return await api.get(`/commercialdemand/product_controller/${id}`);
}
export async function createProduct(data: ProductCreateRequest): Promise<ResponseExternal<ProductResponse>> {
    return await api.put('/commercialdemand/product_controller', data);
}
export async function updateProduct(id: string, data: ProductUpdateRequest): Promise<ResponseExternal<ProductResponse>> {
    return await api.put(`/commercialdemand/product_controller/${id}`, data);
}
export async function deleteByIdProduct(id: string): Promise<ResponseExternal<null>> {
    return await api.delete(`/commercialdemand/product_controller/${id}`);
}
export async function clasifProduct(data: ClasifProductRequest[]): Promise<ResponseExternal<ProductResponse>> {
    return await api.post('/commercialdemand/product_controller/classify_product', data);
}