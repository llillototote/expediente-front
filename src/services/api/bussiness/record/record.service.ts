import { api } from 'src/boot/axios';
import { ResponseExternal } from 'src/common/interface/util';
import { RecordRequest, RecordResponse } from './record.types';

export async function getByIdRecord(
  id: number
): Promise<ResponseExternal<RecordResponse>> {
  return await api.get(`record/${id}`);
}
export async function getAllRecord(): Promise<
  ResponseExternal<RecordResponse[]>
> {
  return await api.get('record');
}
export async function updateRecord(
  id: number,
  data: RecordRequest
): Promise<ResponseExternal<RecordResponse>> {
  return await api.put(`record/${id}`, data);
}
export async function deleteByIdRecord(
  id: number
): Promise<ResponseExternal<null>> {
  return await api.delete(`record/${id}`);
}
export async function createRecord(
  data: RecordRequest
): Promise<ResponseExternal<RecordResponse>> {
  return await api.post('record', data);
}
