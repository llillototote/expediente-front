import { CODES } from "./permisionDTO";

export type RoleResponse = {
    pkRol: string;
    nameRol: string;
    descriptionRol: string;
    permits: string[]
}

export type RoleFindResponse = {
    rolEntity: Omit<RoleResponse, "permits">
    namePermits: CODES[]
}

export type RoleCreateRequest = Omit<RoleResponse, "pkRol">

export type RoleUpdateRequest = Partial<RoleCreateRequest>




