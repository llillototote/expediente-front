<script setup lang="ts">
import { Notify } from 'quasar';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { getByIdProduct, clasifProduct } from 'src/services/external/product';
import { ClasifProductRequest } from 'src/services/external/productDTO';
import { NAMESROUTES } from 'src/services/external/permisionDTO';

// USE GENERAL
const route = useRoute();
const router = useRouter();
// END USE GENERAL

const mode = ref<string>('add');
const id = ref<string | null>(null);
const title = ref<string>('');
const description = ref<string>('');
const code = ref<string>('');
const category = ref<string>('');
const um = ref<string>('');
const priceCUP = ref<number>(0);
const priceCL = ref<number>(0);
const priceMLC = ref<number>(0);

// FORM
const desactivar = ref<boolean>(true);
const confidencial = ref<boolean>(true);

// FORM HELP
const refresh = ref<number>(0);

// END FORM HELP
// END FORM

// METHODS FORM
async function onSubmit() {
  if (mode.value == 'add') {
    console.log('no soportado');
  } else if (mode.value == 'edit' && id.value != null) {
    const resp = await clasifProduct([
      {
        idProduct: id.value,
        disabledProduct: desactivar.value,
        privatedProduct: confidencial.value,
      } as ClasifProductRequest,
    ]);
    if (resp.status == 200 || resp.status == 0) {
      Notify.create({
        message: 'Correcto, producto clasificado satisfactoriamente!',
        textColor: 'white',
        color: 'green',
        position: 'top-right',
      });
      router.push({ name: NAMESROUTES.APP_PRODUCT_LIST });
    } else
      Notify.create({
        message: resp.error,
        textColor: 'white',
        color: 'warning',
        position: 'top-right',
      });
  }
}

function onReset() {
  Notify.create({
    message: 'Info, operación abortada!',
    textColor: 'white',
    color: 'blue',
    position: 'top-right',
  });
  router.push({ name: NAMESROUTES.APP_PRODUCT_LIST });
}

// END METHODS FORM

onMounted(async () => {
  mode.value = route.query?.mode ? route.query?.mode.toString() : 'add';
  if (mode.value == 'add') {
    title.value = 'Adicionar usuario';
  } else {
    title.value = 'Clasificar producto';
    id.value = route.query?.payload ? route.query?.payload.toString() : null;
    if (id.value != null) {
      const recuperate = await getByIdProduct(id.value);
      if (recuperate.status == 200) {
        const { payload } = recuperate;
        if (payload != null) {
          description.value = payload.descriptionProduct;
          category.value = payload.categoryProduct;
          um.value = payload.umProduct;
          code.value = payload.codeProduct;
          priceCL.value = payload.priceCLProduct;
          priceCUP.value = payload.priceCUPProduct;
          priceMLC.value = payload.priceMLCProduct;
          desactivar.value = payload.disabledProduct;
          confidencial.value = payload.privateProduct;
        } else alert('payload vacio');
      } else alert('usuario no recuperado');
    }
  }
});
</script>
<template>
  <q-page class="row q-pa-sm">
    <div class="col-12">
      <h4>{{ title }}</h4>
      <q-form
        ref="myForm"
        @submit.prevent="onSubmit"
        @reset="onReset"
        :key="refresh"
      >
        <div class="row">
          <div class="col-6 q-pa-sm offset-1">
            <q-list padding>
              <q-item tag="label" v-ripple>
                <q-item-section side top>
                  <q-checkbox v-model="desactivar" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>Desactivado</q-item-label>
                  <q-item-label caption>
                    Marcar el producto como no disponible para la confección de
                    demandas
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-separator spaced />
              <q-item tag="label" v-ripple>
                <q-item-section side top>
                  <q-checkbox v-model="confidencial" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>Confidencial</q-item-label>
                  <q-item-label caption>
                    Marcar el producto como confidencial para la confección de
                    demandas exclusivas
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-separator spaced />
            </q-list>
          </div>
          <q-separator vertical inset />
          <div class="col-4 q-pa-sm">
            <q-card class="my-card no-shadow">
              <q-list>
                <q-item clickable>
                  <q-item-section avatar>
                    <q-icon color="primary" name="local_bar" />
                  </q-item-section>

                  <q-item-section>
                    <q-item-label>Descripción</q-item-label>
                    <q-item-label caption>{{ description }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable>
                  <q-item-section avatar>
                    <q-icon color="red" name="local_gas_station" />
                  </q-item-section>

                  <q-item-section>
                    <q-item-label>Categoria</q-item-label>
                    <q-item-label caption>{{ category }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable>
                  <q-item-section avatar>
                    <q-icon color="amber" name="local_movies" />
                  </q-item-section>

                  <q-item-section>
                    <q-item-label>Unidad de medida</q-item-label>
                    <q-item-label caption>{{ um }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable>
                  <q-item-section avatar>
                    <q-icon color="amber" name="local_movies" />
                  </q-item-section>

                  <q-item-section>
                    <q-item-label>Precio en CUP</q-item-label>
                    <q-item-label caption>{{ priceCUP }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable>
                  <q-item-section avatar>
                    <q-icon color="amber" name="local_movies" />
                  </q-item-section>

                  <q-item-section>
                    <q-item-label>Precio en CL</q-item-label>
                    <q-item-label caption>{{ priceCL }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable>
                  <q-item-section avatar>
                    <q-icon color="amber" name="local_movies" />
                  </q-item-section>

                  <q-item-section>
                    <q-item-label>Precio en MLC</q-item-label>
                    <q-item-label caption>{{ priceMLC }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </div>
        </div>
        <div class="row">
          <div class="col-10 q-pa-sm offset-1">
            <q-btn label="Aceptar" type="submit" color="primary" />
            <q-btn
              label="Salir"
              type="reset"
              flat
              color="primary"
              class="q-ml-sm"
            />
          </div>
        </div>
      </q-form>
    </div>
  </q-page>
</template>
