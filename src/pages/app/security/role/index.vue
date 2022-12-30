<template>
  <q-page class="row">
    <div class="col s12">
      <div class="q-pa-md q-gutter-sm">
        <q-btn
          v-if="permisionStore.havePermision('create', ENTITY.ROL)"
          color="primary"
          label="Adicionar"
          :to="{ name: 'role_write', query: { mode: 'add' } }"
        />
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
        :hide="['pkRol']"
      >
      </table-component>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import tableComponent from 'components/generic/tablas/table.vue';
import { ACTIONS } from 'src/common/enum/actions';
import { ButtonAction } from 'src/common/interface/util';
import { useRouter } from 'vue-router';
import promiseDialog from 'src/services/promiseDialog';
import { deleteByIdRole, getAllRole } from 'src/services/external/role';
import { maskObject } from 'src/services/util';
import { RoleResponse } from 'src/services/external/roleDTO';
import { ENTITY } from 'src/services/external/permisionDTO';
import { Mask } from 'src/services/external/utilDTO';
import { usePermisionStore } from 'src/stores/permision-store';

const router = useRouter();
const permisionStore = usePermisionStore();

const seed = ref<any[]>([{ nombre: 123 }]);

const actions: ButtonAction[] = [];
if (permisionStore.havePermision('updateById', ENTITY.ROL))
  actions.push({
    action: ACTIONS.edit,
    color: 'grey',
    text_color: 'white',
    icon: 'edit_note',
  });
if (permisionStore.havePermision('deleteById', ENTITY.ROL))
  actions.push({
    action: ACTIONS.delete,
    color: 'primary',
    text_color: 'white',
    icon: 'delete',
  });

const refresh = ref(0);

async function eliminar(payload: any) {
  const { row } = payload;
  let desicion = await promiseDialog.confirm(
    `Quieres eliminar el rol`,
    `Estás seguro que deseas eliminar el rol ${row['nombre']} ?`,
    'Aceptar'
  );
  if (desicion) {
    const resp = await deleteByIdRole(row['pkRol']);
    if (resp.status == 200) {
      alert('eliminado satisfactoriamente');
    } else alert('no se pudo eliminar');
  } else alert('cancelado');
}

function editar(payload: any) {
  const { row } = payload;
  router.push({
    name: 'role_write',
    query: { mode: 'edit', payload: row['pkRol'] },
  });
}

onMounted(async () => {
  const resp = await getAllRole();
  if (resp.status == 200) {
    const mask: Mask<RoleResponse> = {
      nameRol: 'nombre',
      descriptionRol: 'descripcion',
      pkRol: 'pkRol',
    };
    if (resp.payload != null) {
      const re = resp.payload.map((item: any) => maskObject(item, mask));
      seed.value = re;
    }

    refresh.value++;
  }
});
</script>
