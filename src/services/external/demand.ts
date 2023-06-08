import { api } from 'src/boot/axios';
import { ResponseExternal } from 'src/common/interface/util';
import { AtentionDemandRequest, DemandCreateRequest, DemandFindResponse, DemandResponse, DemandResponseOriginal, DemandUpdateRequest, OfferAndBuyRequest, PlaceToBuyResponse, PriceResponse, TransferDemandRequest } from './demandDTO';


export async function getAllDemandByComercial(): Promise<ResponseExternal<DemandResponseOriginal[]>> {
    return await api.get('/commercialdemand/commercial_demand_controller');
}

export async function getByIdDemand(id: string): Promise<ResponseExternal<DemandResponseOriginal>> {
    return await api.get(`/commercialdemand/commercial_demand_controller/${id}`);
}

export async function atenderDemand(payload: AtentionDemandRequest): Promise<ResponseExternal<unknown>> {
    return await api.put('/commercialdemand/commercial_demand_controller/release', payload);
}

export async function transferirDemand(payload: TransferDemandRequest): Promise<ResponseExternal<unknown>> {
    return await api.put('/commercialdemand/commercial_demand_controller/tranfer', payload);
}

export async function comprarDemand(payload: OfferAndBuyRequest): Promise<ResponseExternal<unknown>> {
    return await api.post('/commercialdemand/commercial_demand_controller/offered_and_forsale', payload);
}

export async function getAllPlaceToBuy(): Promise<ResponseExternal<PlaceToBuyResponse[]>> {
    return await api.get('/commercialdemand/commercial_demand_controller/listPlaceToBuy');
}



