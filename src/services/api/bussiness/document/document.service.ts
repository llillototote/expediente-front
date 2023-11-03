import { api } from 'src/boot/axios';
import { ResponseExternal } from 'src/common/interface/util';
import { DocumentRequest, DocumentResponse } from './document.types';

export async function getByIdDocument(
  id: number
): Promise<ResponseExternal<DocumentResponse>> {
  return await api.get(`document/${id}`);
}
export async function getAllDocument(): Promise<
  ResponseExternal<DocumentResponse[]>
> {
  return await api.get('document');
}
export async function updateDocument(
  id: number,
  data: DocumentRequest
): Promise<ResponseExternal<DocumentResponse>> {
  return await api.put(`document/${id}`, data);
}
export async function deleteByIdDocument(
  id: number
): Promise<ResponseExternal<null>> {
  return await api.delete(`document/${id}`);
}
export async function createDocument(
  data: DocumentRequest
): Promise<ResponseExternal<DocumentResponse>> {
  return await api.post('document', data);
}
