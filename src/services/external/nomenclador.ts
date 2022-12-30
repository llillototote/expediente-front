import { api } from 'src/boot/axios';
import { ResponseExternal } from 'src/common/interface/util';
import { ProvinceResponse } from './userDTO';


export async function getAllProvinces(): Promise<ResponseExternal<ProvinceResponse[]>> {
  return await api.get('/province_controller');
}

