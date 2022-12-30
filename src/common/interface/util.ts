import { ACTIONS } from "../enum/actions";

export interface SelectField {
  label: string;
  value: string;
}

export interface ButtonAction {
  label?: string;
  icon?: string;
  color?: string;
  text_color?: string;
  action: ACTIONS;
}

export interface ResponseExternal<T> {
  status: number;
  error?: string;
  message?: string;
  payload: T | null
}


export interface Qtree<T> {
  label: string;
  disabled?: boolean;
  children?: Qtree<T>[];
}