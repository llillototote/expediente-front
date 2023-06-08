<script setup lang="ts">
import { Notify } from 'quasar';
import { onMounted, ref } from 'vue';
import tableComponent from 'components/generic/tablas/table.vue';
import { ACTIONS } from 'src/common/enum/actions';
import { ButtonAction, SelectField } from 'src/common/interface/util';
import { useRouter } from 'vue-router';
import promiseDialog from 'src/services/promiseDialog';
import {
  deleteByIdRole,
  getAllRole,
  getRolesBindindWithUserClient,
  putRolesBindindWithUserClient,
} from 'src/services/external/role';
import { maskObject, prepareToSelect } from 'src/services/util';
import { RoleResponse } from 'src/services/external/roleDTO';
import { ENTITY, NAMESROUTES } from 'src/services/external/permisionDTO';
import { Mask } from 'src/services/external/utilDTO';
import { usePermisionStore } from 'src/stores/permision-store';
import { useLoadingStore } from 'src/stores/loading-store';

// USE GENERAL
const router = useRouter();
const permisionStore = usePermisionStore();
const loadingStore = useLoadingStore();
// END USE GENERAL

const seed = ref<any[]>([]);

const actions: ButtonAction[] = [];
if (permisionStore.havePermision('updateById', ENTITY.ROL))
  actions.push({
    action: ACTIONS.edit,
    color: 'grey',
    text_color: 'white',
    tooltip: 'Editar',
    icon: 'edit_note',
  });
if (permisionStore.havePermision('deleteById', ENTITY.ROL))
  actions.push({
    action: ACTIONS.delete,
    color: 'primary',
    text_color: 'white',
    tooltip: 'Eliminar',
    icon: 'delete',
  });

const refresh = ref(0);
const rolsSelected = ref<string[]>([]);
const rols = ref<SelectField[]>([]);
const loadingBtn = ref<boolean>(false);
async function eliminar(payload: any) {
  const { row } = payload;
  let desicion = await promiseDialog.confirm(
    'Quieres eliminar el rol',
    `Estás seguro que deseas eliminar el rol ${row['nombre']} ?`,
    'Aceptar'
  );
  if (desicion) {
    const resp = await deleteByIdRole(row['pkRol']);
    if (resp.status == 200) {
      await listarRoles();
      Notify.create({
        message: 'Info, rol eliminado satisfactoriamente!',
        textColor: 'white',
        color: 'blue',
        position: 'top-right',
      });
    } else
      Notify.create({
        message: 'Advertencia, No se pudo eliminar el rol!',
        textColor: 'white',
        color: 'warning',
        position: 'top-right',
      });
  }
}

function editar(payload: any) {
  const { row } = payload;
  router.push({
    name: NAMESROUTES.APP_ROLE_WRITE,
    query: { mode: 'edit', payload: row['pkRol'] },
  });
}

async function listarRoles() {
  const resp = await getAllRole();
  if (resp.status == 200) {
    const mask: Mask<RoleResponse> = {
      nameRol: 'nombre',
      descriptionRol: 'descripcion',
      pkRol: 'pkRol',
      users: 'users',
      permits: 'permits',
    };
    if (resp.payload != null) {
      const re = resp.payload.map((item: any) => maskObject(item, mask));
      seed.value = re;

      let rols_prepared: SelectField[] = [];
      const roles = resp.payload;
      rols_prepared = prepareToSelect(roles, 'nameRol', 'pkRol');
      rols.value = rols_prepared;
    }

    refresh.value++;
  }
}

async function sync() {
  loadingBtn.value = true;
  console.log('sync');
  await putRolesBindindWithUserClient(rolsSelected.value);
  loadingBtn.value = false;
}

onMounted(async () => {
  loadingStore.active();
  await listarRoles();
  const resp = await getRolesBindindWithUserClient();
  console.log(resp);
  if (resp.status == 200) {
    rolsSelected.value = resp.payload == null ? [] : resp.payload;
  } else {
    Notify.create({
      message: 'Info, No hay roles disponibles para registrar un usuario',
      textColor: 'white',
      color: 'warning',
      position: 'top-right',
    });
  }
  loadingStore.inactive();
});
</script>
<template>
  <q-page class="row">
    <div class="col s12">
      <div class="q-pa-md q-gutter-sm">
        <div class="row">
          <div class="col s2">
            <q-btn
              v-if="permisionStore.havePermision('create', ENTITY.ROL)"
              color="primary"
              label="Adicionar"
              :to="{ name: NAMESROUTES.APP_ROLE_WRITE, query: { mode: 'add' } }"
            />
          </div>
          <div class="col s9">
            <q-select
              filled
              v-model="rolsSelected"
              :options="rols"
              label="Roles para registro de clientes"
              multiple
              emit-value
              map-options
            >
              <template
                v-slot:option="{ itemProps, opt, selected, toggleOption }"
              >
                <q-item v-bind="itemProps">
                  <q-item-section>
                    {{ opt.label }}
                  </q-item-section>
                  <q-item-section side>
                    <q-toggle
                      :model-value="selected"
                      @update:model-value="toggleOption(opt)"
                    />
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:after>
                <q-btn
                  v-if="permisionStore.havePermision('create', ENTITY.ROL)"
                  :loading="loadingBtn"
                  color="primary"
                  label="Sincronizar"
                  @click="sync()"
                />
              </template>
            </q-select>
          </div>
        </div>
      </div>

      <table-component
        v-if="permisionStore.havePermision('listAll', ENTITY.ROL)"
        :key="refresh"
        title="Roles"
        :data="seed"
        option="descripcion"
        :actions="actions"
        @edit="editar"
        @delete="eliminar"
        :hide="['pkRol', 'users', 'permits', 'index']"
      >
      </table-component>
    </div>
  </q-page>
</template>
