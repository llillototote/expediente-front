

export type ClientResponse = {
    idClient: string,
    codeClient: string,
    nameClient: string,
    provinceClient: number,
    codeStatus: number,
    statusClient: string,
    dateValidClient: string,
    userName: string | null,
    demands: any
}

export type ClientCreateRequest = Omit<ClientResponse, 'idClient'>

export type ClientUpdateRequest = Partial<ClientCreateRequest>




