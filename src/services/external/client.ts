import { api } from 'src/boot/axios';
import { ResponseExternal } from 'src/common/interface/util';
import { ClientResponse } from './clientDTO';

export async function getAllClient(): Promise<ResponseExternal<ClientResponse[]>> {
  return await api.get('/commercialdemand/client_controller');
}

export async function uploadListClient(params: any): Promise<ResponseExternal<null>> {
  const requestFormData = new FormData();
  requestFormData.append('file', params.file);
  return await api.post('/commercialdemand/pdf-static-file/uploadsclients', requestFormData);
}