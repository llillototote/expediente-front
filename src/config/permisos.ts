import { CODES, ENTITY, PermisionApp } from "src/services/external/permisionDTO";

export const permisionsApp: PermisionApp = {
    create: {
        active: true,
        modules: [
            {
                pkPermits: '',
                code: CODES.USER_CREATE,
                entity: ENTITY.USUARIO,
                description: "create user",
                active: true
            },
            {
                pkPermits: '',
                code: CODES.ROL_CREATE,
                entity: ENTITY.ROL,
                description: "create rol",
                active: true
            }
        ]
    },
    update: {
        active: true,
        modules: []
    },
    delete: {
        active: true,
        modules: []
    },
    listAll: {
        active: true,
        modules: [
            {
                pkPermits: '',
                code: CODES.USERS_LIST_ALL,
                entity: ENTITY.USUARIO,
                description: "list all user",
                active: true
            },
            {
                pkPermits: '',
                code: CODES.ROLS_LIST_ALL,
                entity: ENTITY.ROL,
                description: "list all roles",
                active: true
            }
        ]
    },
    listById: {
        active: true,
        modules: [
            {
                pkPermits: '',
                code: CODES.USER_LIST_BY_ID,
                entity: ENTITY.USUARIO,
                description: "list user by id",
                active: true
            },
            {
                pkPermits: '',
                code: CODES.ROL_LIST_BY_ID,
                entity: ENTITY.ROL,
                description: "list role by id",
                active: true
            }
        ]
    },
    updateById: {
        active: true,
        modules: [
            {
                pkPermits: '',
                code: CODES.USER_UPDATE_BY_ID,
                entity: ENTITY.USUARIO,
                description: "update user by id",
                active: true
            },
            {
                pkPermits: '',
                code: CODES.ROL_UPDATE_BY_ID,
                entity: ENTITY.ROL,
                description: "update role by id",
                active: true
            }
        ]
    },
    deleteById: {
        active: true,
        modules: [
            {
                pkPermits: '',
                code: CODES.USER_DELETE_BY_ID,
                entity: ENTITY.USUARIO,
                description: "delete user by id",
                active: true
            },
            {
                pkPermits: '',
                code: CODES.ROL_DELETE_BY_ID,
                entity: ENTITY.ROL,
                description: "delete role by id",
                active: true
            }
        ]
    },
}