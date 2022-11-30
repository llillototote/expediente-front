<template>
  <div class="q-pa-md">
    <q-table
      v-if="conSeleccion == true"
      class="my-sticky-column-table no-shadow"
      title="Resultado de la búsqueda"
      :rows="data"
      :columns="columns"
      :row-key="rowKey"
      :selected-rows-label="getSelectedString"
      selection="multiple"
      v-model:selected.sync="selected"
    />

    <q-table
      v-else
      class="my-sticky-column-table no-shadow"
      title="Resultado de la búsqueda"
      :rows="data"
      :columns="columns"
      :row-key="rowKey"
    />

    <div class="q-mt-md">Selected: {{ JSON.stringify(selected) }}</div>
  </div>
</template>
<script>
import { prepareDataToTabla } from '../../services/utilities';
export default {
  props: {
    conSeleccion: {
      type: Boolean,
      required: true,
    },
    rowKey: {
      required: true,
    },
    array: {
      required: true,
    },
  },
  data() {
    return {
      selected: [],
      columns: [],
      data: [],
    };
  },
  mounted() {
    let { columns, data } = prepareDataToTabla(this.array);
    this.columns = columns;
    this.data = data;
  },
  methods: {
    getSelectedString() {
      return this.selected.length === 0
        ? ''
        : `${this.selected.length} record${
            this.selected.length > 1 ? 's' : ''
          } selected of ${this.data.length}`;
    },
  },
};
</script>
<style lang="sass">
.my-sticky-column-table
  /* specifying max-width so the example can
    highlight the sticky column on any browser window */
  /*max-width: 600px*/

  thead tr:first-child th:first-child
    /* bg color is important for th; just specify one */
    background-color: #fff

  td:first-child
    background-color: #f5f5dc

  th:first-child,
  td:first-child
    position: sticky
    left: 0
    z-index: 1
</style>
