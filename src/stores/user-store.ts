import { defineStore } from 'pinia';
import {
  LoginResponse,
  UserProfileState,
} from 'src/services/api/auth/user/user.types';

export const useUserStore = defineStore('user', {
  persist: true,
  state: (): UserProfileState => ({
    token_type: 'bearer',
    access_token: '',
    refresh_token: '',
    id: 0,
    email: '',
    username: '',
    roles: [],
    isLoggedIn: false,
  }),
  getters: {
    getProfile(state: UserProfileState): UserProfileState {
      return state;
    },
  },
  actions: {
    loginSuccess(profile: LoginResponse) {
      this.token_type = profile.token_type;
      this.access_token = profile.access_token;
      this.refresh_token = profile.refresh_token;
      this.id = profile.user_logged.id;
      this.username = profile.user_logged.username;
      this.email = profile.user_logged.email;
      this.roles = profile.user_logged.roles;
      this.isLoggedIn = true;
    },
    logoutSuccess() {
      this.token_type = 'bearer';
      this.access_token = '';
      this.refresh_token = '';
      this.id = 0;
      this.username = '';
      this.email = '';
      this.roles = [];
      this.isLoggedIn = false;
    },
    setAccessToken(access_token: string) {
      this.access_token = access_token;
    },
  },
});
