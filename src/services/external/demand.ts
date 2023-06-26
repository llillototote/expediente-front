import { api, apiDownload } from 'src/boot/axios';
import { ResponseExternal } from 'src/common/interface/util';
import { AtentionDemandRequest, DemandResponseOriginal, OfferAndBuyRequest, PlaceToBuyResponse, TransferDemandRequest } from './demandDTO';


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

export async function exportBuySolicitByDemand(id: string): Promise<any> {
    apiDownload.post(`/commercialdemand/commercial_demand_controller/solicitud_compra/${id}`, { responseType: 'arraybuffer', }).then((response) => {
        const fileURL = window.URL.createObjectURL(
            new Blob([response.data], {
                type: 'application/xml',
            })
        );
        const a = document.createElement('a');
        a.setAttribute(
            'download',
            `Solicitud_de_compra_${id}.xml`
        );
        a.setAttribute('href', fileURL);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(fileURL);
    })
}

export async function exportCotizationByDemand(id: string): Promise<any> {
    apiDownload.post(`/commercialdemand/commercial_demand_controller/cotizacion/${id}`, { responseType: 'arraybuffer', }).then((response) => {
        const fileURL = window.URL.createObjectURL(
            new Blob([response.data], {
                type: 'application/xml',
            })
        );
        const a = document.createElement('a');
        a.setAttribute(
            'download',
            `Cotizacion_${id}.xml`
        );
        a.setAttribute('href', fileURL);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(fileURL);
    })
}

export async function exportDemands(ids: string[]): Promise<any> {
    apiDownload.post('/commercialdemand/commercial_demand_controller/export_demands', ids, { responseType: 'arraybuffer', }).then((response) => {
        const fileURL = window.URL.createObjectURL(
            new Blob([response.data], {
                type: 'application/vnd.pdf',
            })
        );
        const a = document.createElement('a');
        a.setAttribute(
            'download',
            'ListadoDemandas.pdf'
        );
        a.setAttribute('href', fileURL);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(fileURL);
    })


}



