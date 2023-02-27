
export type DemandResponse = {
    pkDem: string;
    nro_demanda: string;
    fecha_solicitud: string;
    estado: string;
    importe_total: string;
}

export type DemandFindResponse = {
    demandEntity: Omit<DemandResponse, 'fecha_solicitud'>
}

export type DemandCreateRequest = Omit<DemandResponse, 'pkDem' | 'fecha_solicitud'>

export type DemandUpdateRequest = Partial<DemandCreateRequest>