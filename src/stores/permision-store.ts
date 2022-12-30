import { defineStore } from 'pinia';
import { SelectField } from 'src/common/interface/util';
import { permisionsApp } from 'src/config/permisos';
import { CODES, ENTITY, Module, PermisionApp, PermisionIdealResponse, PermisionResponse } from 'src/services/external/permisionDTO';

export const usePermisionStore = defineStore('permision', {
    persist: true,
    state: () => ({
        permisionsApp
    }),
    getters: {
        getPermisions: (state) => Object.keys(state.permisionsApp),
        getModulesByPermisionCreate: (state) => state.permisionsApp.create.modules.map(it => it.entity),
        getModulesByPermisionListAll: (state) => state.permisionsApp.listAll.modules.map(it => it.entity),
        getModulesByPermisionUpdate: (state) => state.permisionsApp.update.modules.map(it => it.entity),
        getModulesByPermisionDelete: (state) => state.permisionsApp.delete.modules.map(it => it.entity),
        getModulesByPermisionListById: (state) => state.permisionsApp.listById.modules.map(it => it.entity),
        getModulesByPermisionUpdateById: (state) => state.permisionsApp.updateById.modules.map(it => it.entity),
        getModulesByPermisionDeleteById: (state) => state.permisionsApp.deleteById.modules.map(it => it.entity),
    },
    actions: {
        destroyPermisions(): void {
            localStorage.removeItem("permision")
        },
        setPermisionsApp(permisions: PermisionResponse[], granted: CODES[]): void {
            for (const permisionName in this.permisionsApp) {
                if (Object.prototype.hasOwnProperty.call(this.permisionsApp, permisionName)) {
                    this.permisionsApp[permisionName].modules.forEach((module: Module) => {
                        const findedP = permisions.find(it => it.namePermits == module.code)
                        if (findedP) {
                            module.description = findedP.descripctionPermits
                            module.pkPermits = findedP.pkPermits
                        }
                        module.active = granted.includes(module.code)
                    });

                }
            }

        },
        havePermision(permisionName: keyof PermisionApp, entity: ENTITY): boolean {
            if (this.permisionsApp[permisionName].active) {
                const permisionFinded = this.permisionsApp[permisionName].modules.find(it => it.entity == entity)
                if (permisionFinded)
                    return permisionFinded.active
                return true
            } else return true
        },
        getPermisionsID(granted: CODES[]): SelectField[] {
            const resp: SelectField[] = []
            for (const permisionName in this.permisionsApp) {
                if (Object.prototype.hasOwnProperty.call(this.permisionsApp, permisionName)) {
                    this.permisionsApp[permisionName].modules.forEach((module: Module) => {
                        const findedP = granted.find(it => it == module.code)
                        if (findedP) {
                            resp.push({ value: module.pkPermits, label: module.description })
                        }

                    });

                }
            }
            return resp

        },
        getPermisionInfo(granted: string): SelectField {
            console.log(granted)
            for (const permisionName in this.permisionsApp) {
                if (Object.prototype.hasOwnProperty.call(this.permisionsApp, permisionName)) {
                    this.permisionsApp[permisionName].modules.forEach((module: Module) => {
                        if (granted == module.code) {
                            console.log(granted == module.code)
                            return { value: module.pkPermits, label: module.description } as SelectField
                        }
                    });

                }
            }
            return { value: '', label: '' } as SelectField
        },
    },
});
