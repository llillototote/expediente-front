<script setup lang="ts">
import { Notify } from 'quasar';
import { onMounted, ref } from 'vue';
import tableComponent from 'components/generic/tablas/table.vue';
import { ACTIONS } from 'src/common/enum/actions';
import { ButtonAction } from 'src/common/interface/util';
import { useRouter } from 'vue-router';
import promiseDialog from 'src/services/promiseDialog';
import { deleteByIdUser } from 'src/services/external/user';
import {
  getAllProduct,
  uploadListProduct,
} from 'src/services/external/product';
import { maskObject } from 'src/services/util';
import { ENTITY, NAMESROUTES } from 'src/services/external/permisionDTO';
import { Mask } from 'src/services/external/utilDTO';
import { usePermisionStore } from 'src/stores/permision-store';
import { ProductResponse } from 'src/services/external/productDTO';
import { useUserStore } from 'src/stores/user-store';
import { useLoadingStore } from 'src/stores/loading-store';

// USE GENERAL
const router = useRouter();
const permisionStore = usePermisionStore();
const loadingStore = useLoadingStore();
// END USE GENERAL

const seed = ref<any[]>([]);

const actions: ButtonAction[] = [];
if (permisionStore.havePermision('updateById', ENTITY.PRODUCTO))
  actions.push({
    action: ACTIONS.edit,
    color: 'grey',
    text_color: 'white',
    tooltip: 'Clasificar',
    icon: 'auto_fix_high',
  });

const refresh = ref(0);
const uploader = ref(null);

async function eliminar(payload: any) {
  const { row } = payload;
  let desicion = await promiseDialog.confirm(
    'Quieres eliminar el usuario',
    `Estás seguro que deseas eliminar el producto ${row['nombre']} ?`,
    'Aceptar'
  );
  if (desicion) {
    const resp = await deleteByIdUser(row['idProduct']);
    if (resp.status == 200) {
      await listarProductos();
      Notify.create({
        message: 'Info, producto eliminado satisfactoriamente!',
        textColor: 'white',
        color: 'blue',
        position: 'top-right',
      });
    } else
      Notify.create({
        message: 'Advertencia, No se pudo eliminar el producto!',
        textColor: 'white',
        color: 'warning',
        position: 'top-right',
      });
  }
}

function editar(payload: any) {
  const { row } = payload;
  router.push({
    name: NAMESROUTES.APP_PRODUCT_WRITE,
    query: { mode: 'edit', payload: row['idProduct'] },
  });
}

async function listarProductos() {
  const resp = await getAllProduct();
  if (resp.status == 200) {
    const mask: Mask<ProductResponse> = {
      idProduct: 'idProduct',
      categoryProduct: 'categoria',
      codeProduct: 'codigo',
      descriptionProduct: 'descripcion',
      priceCLProduct: 'CL',
      priceCUPProduct: 'CUP',
      priceMLCProduct: 'MLC',
      umProduct: 'um',
      disabledProduct: 'desabilitado',
      privateProduct: 'confidencial',
    };
    if (resp.payload != null) {
      const re = resp.payload.map((item: any) => maskObject(item, mask));
      seed.value = re;
    }

    refresh.value++;
  }
}

async function factoryFn(files: any, updateProgress: any) {
  const params = {
    file: files[0],
  };

  console.log(params);
  const resp = await uploadListProduct(params);
  console.log(resp);
  if (resp.status == 200) {
    Notify.create({
      message: 'Correcto, fichero importado satisfactoriamente!',
      textColor: 'white',
      color: 'green',
      position: 'top-right',
    });
    uploader.value.reset();
    loadingStore.active();
    await listarProductos();
    loadingStore.inactive();
  } else {
    Notify.create({
      message: resp.error,
      textColor: 'white',
      color: 'warning',
      position: 'top-right',
    });
  }
}

function onRejected(rejectedEntries: any) {
  Notify.create({
    type: 'negative',
    message: `${rejectedEntries.length} file(s) did not pass validation constraints`,
  });
}

onMounted(async () => {
  loadingStore.active();
  await listarProductos();
  loadingStore.inactive();
});
</script>
<template>
  <q-page class="row">
    <div class="col s12">
      <div class="q-pa-md q-gutter-sm">
        <q-uploader
          style="max-width: 300px"
          :factory="factoryFn"
          ref="uploader"
          label="Subir fichero excel de productos"
          accept=".xlsx,
           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
         application/vnd.ms-excel"
          @rejected="onRejected"
        />
      </div>

      <table-component
        v-if="permisionStore.havePermision('listAll', ENTITY.PRODUCTO)"
        :key="refresh"
        title="Productos"
        :data="seed"
        option="nombre"
        :actions="actions"
        @edit="editar"
        @delete="eliminar"
        :hide="['idProduct', 'users', 'permits', 'index']"
      >
      </table-component>
    </div>
  </q-page>
</template>
