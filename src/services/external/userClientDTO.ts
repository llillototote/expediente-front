
export type UserClientResponse = {
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

export type UserClientCreateRequest = Omit<UserClientResponse, 'pkPerson'>

export type UserClientUpdateRequest = Partial<UserClientCreateRequest>




