<script setup lang="ts">
import { Notify } from 'quasar';
import { getAllPermision } from 'src/services/external/permision';
import { NAMESROUTES } from 'src/services/external/permisionDTO';
import { login } from 'src/services/external/user';
import { usePermisionStore } from 'src/stores/permision-store';
import { useUserStore } from 'src/stores/user-store';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const permisionStore = usePermisionStore();
const router = useRouter();

const form = reactive({
  isPwd: true,
  user: '', //'super_admin',
  password: '', //'CpxPrivado2022**'
});

const onReset = () => {
  form.password = '';
  form.user = '';
};
const onSubmit = async () => {
  const resp = await login({ username: form.user, password: form.password });
  if (resp.status == 200) {
    if (resp.payload) {
      userStore.loginSuccess(resp.payload);
      const per = await getAllPermision();
      if (per.status == 200) {
        if (per.payload) {
          permisionStore.setPermisionsApp(
            per.payload,
            resp.payload.listPermits
          );
          console.log('permisos desplegados');
          Notify.create({
            message: 'Usuario logueado satisfactoriamente',
            textColor: 'white',
            color: 'green',
            position: 'top-right',
          });
          router.push({ name: NAMESROUTES.APP_HOME });
        }
      } else
        Notify.create({
          message: 'Problemas con obtener los permisos',
          textColor: 'white',
          color: 'warning',
          position: 'top-right',
        });
    }
  } else
    Notify.create({
      message: 'Credenciales no válidas',
      textColor: 'white',
      color: 'warning',
      position: 'top-right',
    });
};
</script>
<template>
  <q-page class="row items-center justify-evenly">
    <div class="q-pa-md" style="width: 400px">
      <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
        <q-card class="my-card no-shadow">
          <q-card-section>
            <q-input
              dense
              outlined
              v-model="form.user"
              label="Usuario *"
              hint="tu usuario aqui"
              autocomplete="off"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.trim().length > 0) ||
                  'Por favor introduce tu usuario',
              ]"
            />
          </q-card-section>

          <q-card-section>
            <q-input
              dense
              label="Contraseña *"
              ref="fieldPass"
              v-model="form.password"
              outlined
              :type="form.isPwd ? 'password' : 'text'"
              autocomplete="off"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) ||
                  'Por favor introduce tu contraseña',
              ]"
            >
              <template v-slot:append>
                <q-icon
                  :name="form.isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="form.isPwd = !form.isPwd"
                />
              </template>
            </q-input>
          </q-card-section>

          <q-card-actions>
            <q-btn label="Aceptar" type="submit" color="primary" />
            <q-btn
              label="Limpiar"
              type="reset"
              color="primary"
              flat
              class="q-ml-sm"
            />
          </q-card-actions>
        </q-card>
      </q-form>
    </div>
  </q-page>
</template>
