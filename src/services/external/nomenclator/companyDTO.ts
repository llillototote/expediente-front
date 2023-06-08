export type CompanyResponse = {
    idCompany: string;
    codeCompany: string;
    nameCompany: string;
    acronymCompany: string;
    addressCompany: string;
    descriptionCompany: string;
}

export type CompanyCreateRequest = Omit<CompanyResponse, 'idCompany'>

export type CompanyUpdateRequest = Partial<CompanyCreateRequest>

export type CompanyShort = { idCompany: string, nameCompany: string }




