import { RoleResponse, RoleShortResponse } from '../role/role.types';

export interface LoginResponse {
  token_type: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  issued_at: string;
  user_logged: UserResponse;
}

export type RefreshResponse = Omit<
  LoginResponse,
  'refresh_token' | 'user_logged'
>;

export interface UserResponse {
  id: number;
  createdAt: string;
  updatedAt: string;
  username: string;
  email: string;
  roles: RoleResponse[];
}

export type UserRequest = {
  username: string;
  email: string;
  secret: string;
  roles: number[];
};

export type UserLoginRequest = Pick<UserRequest, 'username' | 'secret'>;

export interface UserProfileState {
  token_type: string;
  access_token: string;
  refresh_token: string;
  id: number;
  username: string;
  email: string;
  roles: RoleShortResponse[];
  isLoggedIn: boolean;
}
