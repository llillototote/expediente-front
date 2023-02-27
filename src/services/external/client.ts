import { api } from 'src/boot/axios';
import { ResponseExternal } from 'src/common/interface/util';
import { ClientResponse, ClientUpdateRequest } from './clientDTO';

export async function getAllClient(): Promise<ResponseExternal<ClientResponse[]>> {
  return await api.get('/userdemand/client_controller');
}

export async function uploadListClient(params: any): Promise<ResponseExternal<null>> {
  const requestFormData = new FormData();
  requestFormData.append("file", params.file);
  return await api.post("/userdemand/pdf-static-file/uploadsclients", requestFormData);
}