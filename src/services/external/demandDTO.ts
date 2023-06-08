export type PriceResponse = Pick<DemandResponseOriginal, 'totalPriceCUPDemand' | 'totalPriceCLDemand' | 'totalPriceMLCDemand'>

export type ShortProductResponse = {
    quantity: number;
    productID: string;
}
export type DemandResponse = {
    idDemand: string;
    codeDemand: string;
    registeredDate: string;
    statusDemand: string;
    clientID: string;
    productQuantityList: ShortProductResponse[];
    demandProductDTOs: any[];
    demandClientDTO: any[];
    totalPriceCUPDemand: number;
    totalPriceCLDemand: number;
    totalPriceMLCDemand: number;
}



export type DemandResponseOriginal = {
    idDemand: string;
    codeDemand: string;
    registeredDate: string;
    statusDemand: 'Aprobada' | 'Guardada' | 'EnProceso' | 'Atendida' | 'Transferida',
    demandClientDTO: DemandClientDTO;
    demandProductDTOs: DemandProductDTO[],
    totalPriceCLDemand: number;
    totalPriceCUPDemand: number;
    totalPriceMLCDemand: number;
}


export type DemandProductDTO = {
    idProduct: string;
    codeProduct: string;
    descriptionProduct: string;
    umProduct: string;
    priceCUPProduct: number;
    priceCLProduct: number;
    priceMLCProduct: number;
    quantityProduct: number;
    totalPriceCUPProduct: number;
    totalPriceCLProduct: number;
    totalPriceMLCProduct: number;
    offeredProduct: number;
    placeToBuy: string;
    tobuyProduct: number;
    attended: boolean;
}

type ProductAndQuantity = Omit<DemandProductDTO, 'offeredProduct' | 'placeToBuy' | 'tobuyProduct' | 'attended'>

type DemandClientDTO = {
    idClient: string;
    codeClient: string;
    nameClient: string;
    provinceClient: number;
    codeStatus: number;
    dateValidClient: string;
}
export type DemandFindResponse = {
    idDemand: string;
    codeDemand: string;
    statusDemand: string;
    registeredDate: string;
    demandClientDTO: DemandClientDTO,
    demandProductDTOs: ProductAndQuantity[],
    totalPriceCUPDemand: number;
    totalPriceCLDemand: number;
    totalPriceMLCDemand: number;
}


export type DemandCreateRequest = Pick<DemandResponse, 'clientID' | 'productQuantityList'>

export type DemandUpdateRequest = Partial<DemandCreateRequest>

export type AtentionDemandRequest = {
    demandsID: string[];
    status: 'Aprobada' | 'Guardada' | 'EnProceso' | 'Atendida'
}

export type TransferDemandRequest = {
    demandsID: string[];
    province: string;
    division: string;
    matrix: string;
}

export type ProductForSaleDTO = {
    idPlaceToBuy: string;
    offered: number;
    productID: string;
    toBuy: number;
}

export type OfferAndBuyRequest = {
    demandId: string;
    productForSaleDTOs: ProductForSaleDTO[]
}

export type PlaceToBuyResponse = {
    idPlace: string;
    placeName: string;
}
