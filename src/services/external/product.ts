import { api } from 'src/boot/axios';
import { ResponseExternal } from 'src/common/interface/util';
import { ProductCreateRequest, ProductFindResponse, ProductResponse, ProductUpdateRequest } from './productDTO';

export async function uploadListProduct(params: any): Promise<ResponseExternal<null>> {
    const requestFormData = new FormData();
    requestFormData.append("file", params.file);
    return await api.post("/userdemand/pdf-static-file/uploadsproducts", requestFormData);
}

export async function getAllProduct(): Promise<ResponseExternal<ProductResponse[]>> {
    return await api.get('/userdemand/product_controller');
}
export async function getByIdProduct(id: string): Promise<ResponseExternal<ProductFindResponse>> {
    return await api.get(`/security/rol_controller/${id}`);
}
export async function createProduct(data: ProductCreateRequest): Promise<ResponseExternal<ProductResponse>> {
    return await api.put('/security/rol_controller', data);
}
export async function updateProduct(id: string, data: ProductUpdateRequest): Promise<ResponseExternal<ProductResponse>> {
    return await api.put(`/security/rol_controller/${id}`, data);
}
export async function deleteByIdProduct(id: string): Promise<ResponseExternal<null>> {
    return await api.delete(`/security/rol_controller/${id}`);
}