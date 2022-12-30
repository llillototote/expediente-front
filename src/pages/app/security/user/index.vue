<template>
  <q-page class="row">
    <div class="col s12">
      <div class="q-pa-md q-gutter-sm">
        <q-btn
          v-if="permisionStore.havePermision('create', ENTITY.USUARIO)"
          color="primary"
          label="Adicionar"
          :to="{ name: 'user_write', query: { mode: 'add' } }"
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
        ]"
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
import { deleteByIdUser, getAllUser } from 'src/services/external/user';
import { maskObject } from 'src/services/util';
import { UserResponse } from 'src/services/external/userDTO';
import { ENTITY } from 'src/services/external/permisionDTO';
import { Mask } from 'src/services/external/utilDTO';
import { usePermisionStore } from 'src/stores/permision-store';
const router = useRouter();
const permisionStore = usePermisionStore();

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
      alert('eliminado satisfactoriamente');
    } else alert('no se pudo eliminar');
  } else alert('cancelado');
}

function editar(payload: any) {
  console.log(payload);
  const { row } = payload;
  router.push({
    name: 'user_write',
    query: { mode: 'edit', payload: row['pkPerson'] },
  });
}

onMounted(async () => {
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
});
</script>
