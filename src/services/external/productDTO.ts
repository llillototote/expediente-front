
export type ProductResponse = {
    categoryProduct: string;
    codeProduct: string;
    descriptionProduct: string;
    idProduct: string;
    priceCLProduct: number;
    priceCUPProduct: number;
    priceMLCProduct: number;
    umProduct: string;
}

export type ProductFindResponse = {
    demandEntity: Omit<ProductResponse, 'umProduct'>
}

export type ProductCreateRequest = Omit<ProductResponse, 'idProduct'>

export type ProductUpdateRequest = Partial<ProductCreateRequest>