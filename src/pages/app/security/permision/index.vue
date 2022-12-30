<template>
  <q-page class="row">
    <div class="col s12">
      <div class="q-pa-md q-gutter-sm">
        <div class="q-pa-md">
          <q-list>
            <q-expansion-item
              group="permisiongroup"
              icon="grading"
              label="Permisos de Listar cúmulo información de Entidades"
              :header-class="data.listAll.active ? 'text-primary' : 'text-grey'"
              expand-icon-class="text-primary"
            >
              <q-card class="">
                <q-card-section v-if="data.listAll.modules.length > 0">
                  <q-toggle
                    v-model="data.listAll.active"
                    label="Permisos activos"
                  />
                  <q-list bordered>
                    <q-item
                      v-for="(permiso, index) in data.listAll.modules"
                      :key="index"
                      class="q-mb-sm"
                      clickable
                      v-ripple
                    >
                      <q-item-section avatar>
                        <q-avatar
                          :color="
                            data.listAll.active && permiso.active
                              ? 'blue'
                              : 'grey'
                          "
                          text-color="white"
                        >
                          <q-icon name="front_hand" />
                        </q-avatar>
                      </q-item-section>

                      <q-item-section>
                        <q-item-label>{{ permiso.entity }} </q-item-label>
                        <q-item-label caption lines="1">{{
                          permiso.description
                        }}</q-item-label>
                      </q-item-section>

                      <q-item-section side>
                        <q-checkbox v-model="permiso.active" />
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
                <q-card-section v-else>
                  <q-card class="my-card" flat bordered>
                    <q-card-section>
                      <div class="text-h6 q-mt-sm q-mb-xs text-grey">
                        No hay nada que mostrar
                      </div>
                      <div class="text-caption text-grey">
                        Aun no hay permisos en este grupo
                      </div>
                    </q-card-section>
                  </q-card>
                </q-card-section>
              </q-card>
            </q-expansion-item>

            <q-expansion-item
              group="permisiongroup"
              icon="check_circle"
              label="Permisos de Listar información especifica por Entidades"
              :header-class="
                data.listById.active ? 'text-primary' : 'text-grey'
              "
              expand-icon-class="text-primary"
            >
              <q-card>
                <q-card-section v-if="data.listById.modules.length > 0">
                  <q-toggle
                    v-model="data.listById.active"
                    label="Permisos activos"
                  />
                  <q-list bordered>
                    <q-item
                      v-for="(permiso, index) in data.listById.modules"
                      :key="index"
                      class="q-mb-sm"
                      clickable
                      v-ripple
                    >
                      <q-item-section avatar>
                        <q-avatar
                          :color="
                            data.listById.active && permiso.active
                              ? 'blue'
                              : 'grey'
                          "
                          text-color="white"
                        >
                          <q-icon name="front_hand" />
                        </q-avatar>
                      </q-item-section>

                      <q-item-section>
                        <q-item-label>{{ permiso.entity }} </q-item-label>
                        <q-item-label caption lines="1">{{
                          permiso.description
                        }}</q-item-label>
                      </q-item-section>

                      <q-item-section side>
                        <q-checkbox v-model="permiso.active" />
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
                <q-card-section v-else>
                  <q-card class="my-card" flat bordered>
                    <q-card-section>
                      <div class="text-h6 q-mt-sm q-mb-xs text-grey">
                        No hay nada que mostrar
                      </div>
                      <div class="text-caption text-grey">
                        Aun no hay permisos en este grupo
                      </div>
                    </q-card-section>
                  </q-card>
                </q-card-section>
              </q-card>
            </q-expansion-item>

            <q-expansion-item
              group="permisiongroup"
              icon="add_box"
              label="Permisos de crear información de Entidades"
              :header-class="data.create.active ? 'text-primary' : 'text-grey'"
              expand-icon-class="text-primary"
            >
              <q-card>
                <q-card-section v-if="data.create.modules.length > 0">
                  <q-toggle
                    v-model="data.create.active"
                    label="Permisos activos"
                  />
                  <q-list bordered>
                    <q-item
                      v-for="(permiso, index) in data.create.modules"
                      :key="index"
                      class="q-mb-sm"
                      clickable
                      v-ripple
                    >
                      <q-item-section avatar>
                        <q-avatar
                          :color="
                            data.create.active && permiso.active
                              ? 'primary'
                              : 'grey'
                          "
                          text-color="white"
                        >
                          <q-icon name="front_hand" />
                        </q-avatar>
                      </q-item-section>

                      <q-item-section>
                        <q-item-label>{{ permiso.entity }} </q-item-label>
                        <q-item-label caption lines="1">{{
                          permiso.description
                        }}</q-item-label>
                      </q-item-section>

                      <q-item-section side>
                        <q-checkbox v-model="permiso.active" />
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
                <q-card-section v-else>
                  <q-card class="my-card" flat bordered>
                    <q-card-section>
                      <div class="text-h6 q-mt-sm q-mb-xs text-grey">
                        No hay nada que mostrar
                      </div>
                      <div class="text-caption text-grey">
                        Aun no hay permisos en este grupo
                      </div>
                    </q-card-section>
                  </q-card>
                </q-card-section>
              </q-card>
            </q-expansion-item>

            <q-expansion-item
              group="permisiongroup"
              icon="edit_note"
              label="Permisos de Modificar cúmulo información de Entidades"
              :header-class="data.update.active ? 'text-primary' : 'text-grey'"
              expand-icon-class="text-primary"
            >
              <q-card>
                <q-card-section v-if="data.update.modules.length > 0">
                  <q-toggle
                    v-model="data.update.active"
                    label="Permisos activos"
                  />
                  <q-list bordered>
                    <q-item
                      v-for="(permiso, index) in data.update.modules"
                      :key="index"
                      class="q-mb-sm"
                      clickable
                      v-ripple
                    >
                      <q-item-section avatar>
                        <q-avatar
                          :color="
                            data.update.active && permiso.active
                              ? 'warning'
                              : 'grey'
                          "
                          text-color="white"
                        >
                          <q-icon name="front_hand" />
                        </q-avatar>
                      </q-item-section>

                      <q-item-section>
                        <q-item-label>{{ permiso.entity }} </q-item-label>
                        <q-item-label caption lines="1">{{
                          permiso.description
                        }}</q-item-label>
                      </q-item-section>

                      <q-item-section side>
                        <q-checkbox v-model="permiso.active" />
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
                <q-card-section v-else>
                  <q-card class="my-card" flat bordered>
                    <q-card-section>
                      <div class="text-h6 q-mt-sm q-mb-xs text-grey">
                        No hay nada que mostrar
                      </div>
                      <div class="text-caption text-grey">
                        Aun no hay permisos en este grupo
                      </div>
                    </q-card-section>
                  </q-card>
                </q-card-section>
              </q-card>
            </q-expansion-item>

            <q-expansion-item
              group="permisiongroup"
              icon="edit"
              label="Permisos de Modificar información especifica por Entidades"
              :header-class="
                data.updateById.active ? 'text-primary' : 'text-grey'
              "
              expand-icon-class="text-primary"
            >
              <q-card>
                <q-card-section v-if="data.updateById.modules.length > 0">
                  <q-toggle
                    v-model="data.updateById.active"
                    label="Permisos activos"
                  />
                  <q-list bordered>
                    <q-item
                      v-for="(permiso, index) in data.updateById.modules"
                      :key="index"
                      class="q-mb-sm"
                      clickable
                      v-ripple
                    >
                      <q-item-section avatar>
                        <q-avatar
                          :color="
                            data.updateById.active && permiso.active
                              ? 'warning'
                              : 'grey'
                          "
                          text-color="white"
                        >
                          <q-icon name="front_hand" />
                        </q-avatar>
                      </q-item-section>

                      <q-item-section>
                        <q-item-label>{{ permiso.entity }} </q-item-label>
                        <q-item-label caption lines="1">{{
                          permiso.description
                        }}</q-item-label>
                      </q-item-section>

                      <q-item-section side>
                        <q-checkbox v-model="permiso.active" />
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
                <q-card-section v-else>
                  <q-card class="my-card" flat bordered>
                    <q-card-section>
                      <div class="text-h6 q-mt-sm q-mb-xs text-grey">
                        No hay nada que mostrar
                      </div>
                      <div class="text-caption text-grey">
                        Aun no hay permisos en este grupo
                      </div>
                    </q-card-section>
                  </q-card>
                </q-card-section>
              </q-card>
            </q-expansion-item>

            <q-expansion-item
              group="permisiongroup"
              icon="delete_sweep"
              label="Permisos de Eliminar cúmulo información de Entidades"
              :header-class="data.delete.active ? 'text-primary' : 'text-grey'"
              expand-icon-class="text-primary"
            >
              <q-card>
                <q-card-section v-if="data.delete.modules.length > 0">
                  <q-toggle
                    v-model="data.delete.active"
                    label="Permisos activos"
                  />
                  <q-list bordered>
                    <q-item
                      v-for="(permiso, index) in data.delete.modules"
                      :key="index"
                      class="q-mb-sm"
                      clickable
                      v-ripple
                    >
                      <q-item-section avatar>
                        <q-avatar
                          :color="
                            data.delete.active && permiso.active
                              ? 'primary'
                              : 'grey'
                          "
                          text-color="white"
                        >
                          <q-icon name="front_hand" />
                        </q-avatar>
                      </q-item-section>

                      <q-item-section>
                        <q-item-label>{{ permiso.entity }} </q-item-label>
                        <q-item-label caption lines="1">{{
                          permiso.description
                        }}</q-item-label>
                      </q-item-section>

                      <q-item-section side>
                        <q-checkbox v-model="permiso.active" />
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
                <q-card-section v-else>
                  <q-card class="my-card" flat bordered>
                    <q-card-section>
                      <div class="text-h6 q-mt-sm q-mb-xs text-grey">
                        No hay nada que mostrar
                      </div>
                      <div class="text-caption text-grey">
                        Aun no hay permisos en este grupo
                      </div>
                    </q-card-section>
                  </q-card>
                </q-card-section>
              </q-card>
            </q-expansion-item>

            <q-expansion-item
              group="permisiongroup"
              icon="delete_forever"
              label="Permisos de Eliminar información especifica por Entidades"
              :header-class="
                data.deleteById.active ? 'text-primary' : 'text-grey'
              "
              expand-icon-class="text-primary"
            >
              <q-card>
                <q-card-section v-if="data.deleteById.modules.length > 0">
                  <q-toggle
                    v-model="data.deleteById.active"
                    label="Permisos activos"
                  />
                  <q-list bordered>
                    <q-item
                      v-for="(permiso, index) in data.deleteById.modules"
                      :key="index"
                      class="q-mb-sm"
                      clickable
                      v-ripple
                    >
                      <q-item-section avatar>
                        <q-avatar
                          :color="
                            data.deleteById.active && permiso.active
                              ? 'primary'
                              : 'grey'
                          "
                          text-color="white"
                        >
                          <q-icon name="front_hand" />
                        </q-avatar>
                      </q-item-section>

                      <q-item-section>
                        <q-item-label>{{ permiso.entity }} </q-item-label>
                        <q-item-label caption lines="1">{{
                          permiso.description
                        }}</q-item-label>
                      </q-item-section>

                      <q-item-section side>
                        <q-checkbox v-model="permiso.active" />
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
                <q-card-section v-else>
                  <q-card class="my-card" flat bordered>
                    <q-card-section>
                      <div class="text-h6 q-mt-sm q-mb-xs text-grey">
                        No hay nada que mostrar
                      </div>
                      <div class="text-caption text-grey">
                        Aun no hay permisos en este grupo
                      </div>
                    </q-card-section>
                  </q-card>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import promiseDialog from 'src/services/promiseDialog';
import { getAllPermision } from 'src/services/external/permision';
import { permisionsApp } from 'src/config/permisos';
import { usePermisionStore } from 'src/stores/permision-store';
const router = useRouter();
const permisionStore = usePermisionStore();
const data = permisionStore.permisionsApp;
onMounted(async () => {
  //const resp = await getAllPermision();
  /*if (resp.status == 200) {
    if (resp.payload != null) {
    }
  }*/
});
</script>
