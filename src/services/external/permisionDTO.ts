import { RoleResponse } from "./roleDTO";

export type PermisionResponse = {
    pkPermits: string;
    controllerPermits: string;
    namePermits: CODES;
    methodPermits: string;
    pathPermits: string;
    functionPermits: string;
    paramsPermits: string;
    producePermits: string;
    activePermits: boolean;
    descripctionPermits: string;
}

export type PermisionIdealResponse = {
    pkPermits: string;
    code: CODES;
    descripcion: string;
}

export enum CODES {
    ROLS_LIST_ALL = "ROLS_LIST_ALL",
    ROL_LIST_BY_ID = "ROL_LIST_BY_ID",
    ROL_CREATE = "ROL_CREATE",
    ROL_UPDATE_BY_ID = "ROL_UPDATE_BY_ID",
    ROL_DELETE_BY_ID = "ROL_DELETE_BY_ID",
    USERS_LIST_ALL = "USERS_LIST_ALL",
    USER_LIST_BY_ID = "USER_LIST_BY_ID",
    USER_CREATE = "USER_CREATE",
    USER_UPDATE_BY_ID = "USER_UPDATE_BY_ID",
    USER_DELETE_BY_ID = "USER_DELETE_BY_ID",
    USER_CHECK_PASSWORK = "USER_CHECK_PASSWORK",
    PERMITS_LIST_ALL = "PERMITS_LIST_ALL",
    PROVINCES_LIST_ALL = "PROVINCES_LIST_ALL",
}

export enum ENTITY {
    USUARIO = "USUARIO",
    ROL = "ROL",
}



export type Module = {
    pkPermits: string;
    code: CODES;
    entity: ENTITY;
    active: boolean;
    description: string;
}

type Permision = {
    active: boolean;
    modules: Module[]
}



export type ModulePermisionApp = Record<string, Permision>

export type PermisionApp = {
    create: Permision;
    update: Permision;
    delete: Permision;
    listAll: Permision;
    listById: Permision;
    updateById: Permision;
    deleteById: Permision;
}

export type PermisionCreateRequest = Omit<PermisionResponse, "pkPermits">

export type PermisionUpdateRequest = Partial<PermisionCreateRequest>