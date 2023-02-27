import { CODES, ENTITY, NAMESROUTES, PermisionApp, PermisionsRoutesApp } from 'src/services/external/permisionDTO';

export const permisionsApp: PermisionApp = {
    create: {
        active: true,
        modules: [
            {
                pkPermits: '',
                code: CODES.CREAR_USUARIO,
                entity: ENTITY.USUARIO,
                description: 'create user',
                active: true
            },
            {
                pkPermits: '',
                code: CODES.CREAR_ROL,
                entity: ENTITY.ROL,
                description: 'create rol',
                active: true
            },
            {
                pkPermits: '',
                code: CODES.CREAR_CLIENTE,
                entity: ENTITY.CLIENTE,
                description: 'create client',
                active: true
            },
            {
                pkPermits: '',
                code: CODES.CREAR_DEMANDA,
                entity: ENTITY.DEMANDA,
                description: 'create demand',
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
                code: CODES.LISTAR_USUARIOS,
                entity: ENTITY.USUARIO,
                description: 'list all user',
                active: true
            },
            {
                pkPermits: '',
                code: CODES.LISTAR_ROLES,
                entity: ENTITY.ROL,
                description: 'list all roles',
                active: true
            },
            {
                pkPermits: '',
                code: CODES.LISTAR_CLIENTES,
                entity: ENTITY.CLIENTE,
                description: 'list all client',
                active: true
            },
            {
                pkPermits: '',
                code: CODES.LISTAR_DEMANDA_USUARIO,
                entity: ENTITY.DEMANDA,
                description: 'lista all demands',
                active: true
            },
            {
                pkPermits: '',
                code: CODES.LISTAR_PRODUCTOS,
                entity: ENTITY.PRODUCTO,
                description: 'lista all products',
                active: true
            },
            {
                pkPermits: '',
                code: CODES.OBTENER_LISTADO_DE_PRODUCTO_POR_NOMBRE,
                entity: ENTITY.PRODUCTO,
                description: 'list product by name',
                active: true
            },
        ]
    },
    listById: {
        active: true,
        modules: [
            {
                pkPermits: '',
                code: CODES.OBTENER_USUARIO_POR_ID,
                entity: ENTITY.USUARIO,
                description: 'list user by id',
                active: true
            },
            {
                pkPermits: '',
                code: CODES.OBTENER_ROL_POR_ID,
                entity: ENTITY.ROL,
                description: 'list role by id',
                active: true
            },
            {
                pkPermits: '',
                code: CODES.OBTENER_CLIENTE_POR_ID,
                entity: ENTITY.CLIENTE,
                description: 'list client by id',
                active: true
            },
            {
                pkPermits: '',
                code: CODES.OBTENER_CLIENTE_POR_NOMBRE_USUARIO,
                entity: ENTITY.CLIENTE,
                description: 'list client by name',
                active: true
            },
            {
                pkPermits: '',
                code: CODES.OBTENER_PRODUCTO_POR_CODIGO,
                entity: ENTITY.PRODUCTO,
                description: 'get product by code',
                active: true
            },
            {
                pkPermits: '',
                code: CODES.OBTENER_PRODUCTO_POR_ID,
                entity: ENTITY.PRODUCTO,
                description: 'get product by id',
                active: true
            }
        ]
    },
    updateById: {
        active: true,
        modules: [
            {
                pkPermits: '',
                code: CODES.MODIFICAR_USUARIO_POR_ID,
                entity: ENTITY.USUARIO,
                description: 'update user by id',
                active: true
            },
            {
                pkPermits: '',
                code: CODES.MODIFICAR_ROL_POR_ID,
                entity: ENTITY.ROL,
                description: 'update role by id',
                active: true
            },
            {
                pkPermits: '',
                code: CODES.MODIFICAR_DEMANDA_POR_ID,
                entity: ENTITY.DEMANDA,
                description: 'update demand by id',
                active: true
            },
            {
                pkPermits: '',
                code: CODES.MODIFICAR_USUARIO_CLIENTE_POR_ID,
                entity: ENTITY.CLIENTE,
                description: 'update user client by id',
                active: true
            },
            {
                pkPermits: '',
                code: CODES.MODIFICAR_CLIENTE_POR_ID,
                entity: ENTITY.CLIENTE,
                description: 'update client by id n',
                active: true
            }
        ]
    },
    deleteById: {
        active: true,
        modules: [
            {
                pkPermits: '',
                code: CODES.ELIMINAR_USUARIO_POR_ID,
                entity: ENTITY.USUARIO,
                description: 'delete user by id',
                active: true
            },
            {
                pkPermits: '',
                code: CODES.ELIMINAR_ROL_POR_ID,
                entity: ENTITY.ROL,
                description: 'delete role by id',
                active: true
            },
            {
                pkPermits: '',
                code: CODES.ELIMINAR_DEMANDA_POR_ID,
                entity: ENTITY.DEMANDA,
                description: 'delete demand by id',
                active: true
            },
            {
                pkPermits: '',
                code: CODES.ELIMINAR_CLIENTE_POR_ID,
                entity: ENTITY.CLIENTE,
                description: 'delete client by id',
                active: true
            }
        ]
    },
}

export const permisionsRoutesApp: PermisionsRoutesApp[] = [
    {
        routename: NAMESROUTES.APP_ROLE_LIST,
        dependencies: [CODES.LISTAR_ROLES]
    },
    {
        routename: NAMESROUTES.APP_USER_LIST,
        dependencies: [CODES.LISTAR_USUARIOS]
    },
    {
        routename: NAMESROUTES.APP_PRODUCT_LIST,
        dependencies: [CODES.LISTAR_PRODUCTOS]
    },
    {
        routename: NAMESROUTES.APP_CLIENT_LIST,
        dependencies: [CODES.LISTAR_CLIENTES]
    }
]