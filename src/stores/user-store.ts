import { defineStore } from 'pinia';
import { LoginResponse, PayloadLoginStore } from 'src/services/external/userDTO';

export const useUserStore = defineStore('user', {
  persist: true,
  state: () => ({
    profile: {
      token: '',
      bearer: '',
      userName: '',
      namePerson: '',
      authorities: [],
      listPermits: []
    } as PayloadLoginStore

  }),
  getters: {
    getProfile: (state) => state.profile,
  },
  actions: {
    loginSuccess(profile: LoginResponse) {
      this.profile.bearer = profile.bearer
      this.profile.token = profile.token
      this.profile.userName = profile.userName
      this.profile.namePerson = profile.namePerson
      this.profile.listPermits = profile.listPermits
      this.profile.authorities = profile.authorities
    },
    logoutSuccess() {
      this.profile.bearer = ''
      this.profile.token = ''
      this.profile.userName = ''
      this.profile.namePerson = ''
      this.profile.listPermits = []
      this.profile.authorities = []
    }
  },
});
