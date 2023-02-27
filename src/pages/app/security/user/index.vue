<script setup lang="ts">
import { Notify } from 'quasar';
import { onMounted, ref } from 'vue';
import tableComponent from 'components/generic/tablas/table.vue';
import { ACTIONS } from 'src/common/enum/actions';
import { ButtonAction } from 'src/common/interface/util';
import { useRouter } from 'vue-router';
import promiseDialog from 'src/services/promiseDialog';
import { deleteByIdUser, getAllUser } from 'src/services/external/user';
import { maskObject } from 'src/services/util';
import { UserResponse } from 'src/services/external/userDTO';
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
if (permisionStore.havePermision('updateById', ENTITY.USUARIO))
  actions.push({
    action: ACTIONS.edit,
    color: 'grey',
    text_color: 'white',
    icon: 'edit_note',
  });
if (permisionStore.havePermision('deleteById', ENTITY.USUARIO))
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
    `Quieres eliminar el usuario`,
    `Estás seguro que deseas eliminar el usuario ${row['nombre']} ?`,
    'Aceptar'
  );
  if (desicion) {
    const resp = await deleteByIdUser(row['pkPerson']);
    if (resp.status == 200) {
      await listarUsuarios();
      Notify.create({
        message: `Info, usuario eliminado satisfactoriamente!`,
        textColor: 'white',
        color: 'blue',
        position: 'top-right',
      });
    } else
      Notify.create({
        message: `Advertencia, No se pudo eliminar el usuario!`,
        textColor: 'white',
        color: 'warning',
        position: 'top-right',
      });
  }
}

function editar(payload: any) {
  const { row } = payload;
  router.push({
    name: NAMESROUTES.APP_USER_WRITE,
    query: { mode: 'edit', payload: row['pkPerson'] },
  });
}

async function listarUsuarios() {
  const resp = await getAllUser();
  if (resp.status == 200) {
    const mask: Mask<UserResponse> = {
      namePerson: 'nombre',
      firstLastNamePerson: 'primer_apellido',
      secondLastNamePerson: 'segundo_apellido',
      usernamePerson: 'usuario',
      emailPerson: 'correo',
      activePerson: 'estado',
      identityCardPerson: 'identityCardPerson',
      genderPerson: 'genderPerson',
      passwordPerson: 'passwordPerson',
      pkPerson: 'pkPerson',
      rols: 'rols',
      provincePerson: 'provincePerson',
    };
    if (resp.payload != null) {
      const re = resp.payload.map((item: any) => maskObject(item, mask));
      seed.value = re;
    }

    refresh.value++;
  }
}

onMounted(async () => {
  loadingStore.active();
  await listarUsuarios();
  loadingStore.inactive();
});
</script>
<template>
  <q-page class="row">
    <div class="col s12">
      <div class="q-pa-md q-gutter-sm">
        <q-btn
          v-if="permisionStore.havePermision('create', ENTITY.USUARIO)"
          color="primary"
          label="Adicionar"
          :to="{ name: NAMESROUTES.APP_USER_WRITE, query: { mode: 'add' } }"
        />
      </div>

      <table-component
        v-if="permisionStore.havePermision('listAll', ENTITY.USUARIO)"
        :key="refresh"
        title="Usuarios"
        :data="seed"
        option="nombre"
        :actions="actions"
        @edit="editar"
        @delete="eliminar"
        :hide="[
          'pkPerson',
          'passwordPerson',
          'rols',
          'genderPerson',
          'identityCardPerson',
          'provincePerson',
          'index',
        ]"
      >
      </table-component>
    </div>
  </q-page>
</template>
