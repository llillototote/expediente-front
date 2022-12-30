import { CODES } from "./permisionDTO";
import { RoleResponse } from "./roleDTO";


type Autority = {
    authority: string;
}
export type LoginResponse = {
    authorities: Autority[];
    bearer: string;
    listPermits: CODES[];
    namePerson: string;
    token: string;
    userName: string;
}

export type PayloadLoginStore = LoginResponse

export type LoginRequest = {
    authLocal: boolean;
    password: string;
    username: string;
}

export type DataLoginBasic = Omit<LoginRequest, "authLocal">

export enum GENDER {
    F = "F",
    M = "M",
}

export type UserResponse = {
    pkPerson: string;
    usernamePerson: string;
    namePerson: string;
    identityCardPerson: string;
    firstLastNamePerson: string;
    secondLastNamePerson: string;
    emailPerson: string;
    passwordPerson: string;
    genderPerson: GENDER,
    rols: string[];
    activePerson: boolean;
    provincePerson: string;
}

export type ProvinceResponse = {
    provinceID: string;
    provinceName: string;
    provinceAcronyms: string;
}

export type UserUserFindedResponse = {
    pkPerson: string;
    usernamePerson: string;
    namePerson: string;
    identityCardPerson: string;
    firstLastNamePerson: string;
    secondLastNamePerson: string;
    emailPerson: string;
    passwordPerson: string;
    genderPerson: GENDER,
    rols: RoleResponse[];
    activePerson: boolean;
    province: ProvinceResponse;
}

export type UserFindedResponse = {
    user: UserUserFindedResponse;
    province: ProvinceResponse;
}

export type UserCreateRequest = Omit<UserResponse, "pkPerson">

export type UserUpdateRequest = Partial<UserCreateRequest>




