import { AxiosRequestConfig } from 'axios';
import { defineStore } from 'pinia';

export const useAxiosRefreshStore = defineStore('axiosrefresh', {
  persist: true,
  state: () => ({
    retryCount: 0,
    lastConfig: {} as AxiosRequestConfig,
    preLastConfig: {} as AxiosRequestConfig,
  }),
  getters: {
    getLastConfig: (state) => state.lastConfig,
    getPreLastConfig: (state) => state.preLastConfig,
    canRetry: (state) => state.retryCount >= 1,
  },
  actions: {
    setLastConfig(config: AxiosRequestConfig) {
      this.lastConfig = config;
    },
    setPreLastConfig(config: AxiosRequestConfig) {
      this.preLastConfig = config;
    },
    incrementRetry() {
      this.retryCount++;
    },
    resetRetry() {
      this.retryCount = 0;
    },
  },
});
