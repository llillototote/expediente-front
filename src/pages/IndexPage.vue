<template>
  <q-page class="row items-center justify-evenly">
    <div class="col s12">
      <table-component
        :data="seed"
        option="email"
        :actions="actions"
        :hide="['email']"
      ></table-component>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { Todo, Meta } from 'components/models';
import tableComponent from 'components/generic/tablas/table.vue';
import { onMounted, ref } from 'vue';
import { ACTIONS } from 'src/common/enum/actions';
import { ButtonAction } from 'src/common/interface/util';

const seed = ref<any[]>([
  {
    name: 'Pepe',
    email: 'pepe@cc.cu',
    provincia: 'Artemisa',
  },
  {
    name: 'Ale',
    email: 'ale@cc.cu',
    provincia: 'La Habana',
  },
]);

const actions: ButtonAction[] = [
  {
    action: ACTIONS.show,
    color: 'info',
    text_color: 'white',
    icon: 'info',
  },
  {
    action: ACTIONS.delete,
    color: 'primary',
    text_color: 'white',
    icon: 'delete',
  },
  {
    action: ACTIONS.edit,
    color: 'grey',
    text_color: 'black',
    icon: 'edit',
  },
];

function eliminar(payload: any) {
  console.log(payload);
}

function editar(payload: any) {
  console.log(payload);
}

const meta = ref<Meta>({
  totalCount: 1200,
});

onMounted(async () => {
  console.log('Haciendo un request');
  //await register();
});
</script>
