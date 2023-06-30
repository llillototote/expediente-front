import { api } from 'src/boot/axios';
import { ResponseExternal } from 'src/common/interface/util';
import { ProvinceResponse } from './provinceDTO';


export async function getAllProvinces(): Promise<ResponseExternal<ProvinceResponse[]>> {
    return await api.get('/security/province_controller');
}