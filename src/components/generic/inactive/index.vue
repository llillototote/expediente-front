<template>
  <div>
    <!-- <GlobalEvents
  @mousemove="sensorMouse"
  @keyup="sensorKeyboard"
  @scroll="sensorScroll"
/> -->
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { mapActions } from 'vuex';
import config from 'src/configuracion/index';
import { useQuasar } from 'quasar';
import { qs } from 'src/services/promiseDialog';

export default defineComponent({
  setup() {
    let idleTimeCuota = config.idle_time;
    const $q = useQuasar();

    return {
      idleTimeCuota,
      showNotifError({ msg, title }) {
        $q.notify({
          message: title,
          caption: msg,
          color: 'red',
          icon: 'announcement',
          position: 'top-right',
        });
      },
      showNotifSuccess({ msg, title }) {
        $q.notify({
          message: title,
          caption: msg,
          color: 'green',
          icon: 'info',
          position: 'top-right',
        });
      },
    };
  },
  created() {
    window.addEventListener('mousemove', this.sensor);
    window.addEventListener('keyup', this.sensor);
    window.addEventListener('scroll', this.sensor);
  },
  mounted() {
    this.contarTiempoInactividad();
  },
  data() {
    return {
      idleTime: 0,
      sedioorden: false,
      id_interval: null,
      cuota: this.idleTimeCuota,
    };
  },
  methods: {
    ...mapActions({
      logoutAction: 'user/logoutAction',
    }),
    async sensor(e) {
      if (this.idleTime >= this.cuota) {
        if (this.sedioorden) {
        } else {
          this.sedioorden = true;
          this.showNotifError({
            title: 'Inactividad',
            msg: 'sesion expirada por inactividad',
          });
          const status = await this.logoutAction();
          if (status.id == null) {
            qs.hide();
            this.$router.push({ name: 'access' });
          }
        }
      }
      this.idleTime = 0;
    },
    contarTiempoInactividad() {
      this.id_interval = setInterval(() => {
        this.idleTime++;
        // console.log(this.idleTime)
        if (this.idleTime >= this.cuota) {
          // console.log(`${this.cuota} seg de inactividad`)
          clearInterval(this.id_interval);
        }
      }, 1000);
    },
  },
  unmounted() {
    clearInterval(this.id_interval);
    // window.removeEventListener('mousemove')
    // window.removeEventListener('keyup')
    // window.removeEventListener('scroll')
  },
});
</script>

<style></style>
