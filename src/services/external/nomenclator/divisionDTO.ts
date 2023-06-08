
export type DivisionResponse = {
    descriptionTerritorialDivision: string,
    nameTerritorial: string,
    pkTerritorialDivision: string,
    fkProvince: string
}

export type DivisionCreateRequest = Omit<DivisionResponse, 'pkTerritorialDivision'>

export type DivisionUpdateRequest = Partial<DivisionCreateRequest>

export type DivisionShort = { pkTerritorialDivision: string, fkProvince: string, nameTerritorial: string, descriptionTerritorialDivision: string }