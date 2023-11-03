import { api } from 'src/boot/axios';
import { ResponseExternal } from 'src/common/interface/util';
import { PositionRequest, PositionResponse } from './position.types';

export async function getByIdPosition(
  id: number
): Promise<ResponseExternal<PositionResponse>> {
  return await api.get(`position/${id}`);
}
export async function getAllPosition(): Promise<
  ResponseExternal<PositionResponse[]>
> {
  return await api.get('position');
}
export async function updatePosition(
  id: number,
  data: PositionRequest
): Promise<ResponseExternal<PositionResponse>> {
  return await api.put(`position/${id}`, data);
}
export async function deleteByIdPosition(
  id: number
): Promise<ResponseExternal<null>> {
  return await api.delete(`position/${id}`);
}
export async function createPosition(
  data: PositionRequest
): Promise<ResponseExternal<PositionResponse>> {
  return await api.post('position', data);
}
