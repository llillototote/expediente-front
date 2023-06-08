

export type UserClientResponse = {
    pkUser: string;
    nameUser: string;
    identityCardUser: string;
    usernameUser: string;
    emailUser: string;
    phoneUser: string;
    companyUser: string;
    provinceUser: string;
    activeUser: boolean;
    rols: string[];
}

export type UserClientFindResponse = {
    user: {
        pkUser: string;
        nameUser: string;
        identityCardUser: string;
        usernameUser: string;
        emailUser: string;
        phoneUser: string;
        companyUser: string;
        activeUser: boolean;
        deletedUser: boolean;
        rols: [
            {
                pkRol: string;
                nameRol: string;
                descriptionRol: string;
                deletedRol: boolean;
                bindClient: boolean;
            }
        ]
    },
    province: {
        provinceID: string;
        provinceName: string;
        provinceAcronyms: string;
    }
}

export type UserClientCreateRequest = Omit<UserClientResponse, 'pkUser'>

export type UserClientUpdateRequest = Partial<UserClientCreateRequest>




