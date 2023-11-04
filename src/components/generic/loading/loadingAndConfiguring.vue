<template>
  <div class="q-pa-md"></div>
</template>

<script>
import { QSpinnerGears, QSpinnerFacebook } from 'quasar';
import { defineComponent } from 'vue';
export default defineComponent({
  props: ['triger', 'message'],
  created() {
    if (this.triger) {
      this.showLoading();
    } else {
      this.firstDestroy();
    }
  },
  methods: {
    showLoading() {
      this.$q.loading.show({
        spinner: QSpinnerFacebook,
        message: this.message,
        spinnerColor: 'red-10',
        messageColor: 'black',
        backgroundColor: 'red-2 ',
      });
    },
    firstDestroy() {
      this.$q.loading.hide();
      this.second();
    },
    second() {
      this.$q.loading.show({
        delay: 200,
        spinner: QSpinnerGears,
        spinnerColor: 'red',
        messageColor: 'black',
        backgroundColor: 'yellow',
        message: 'Configurando sus permisos',
      });

      this.$q.loading.hide();
    },
  },
});
</script>
