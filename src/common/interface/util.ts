import { ACTIONS } from '../enum/actions';

export interface SelectField {
  label: string;
  value: string;
}

interface DisabledButtonCriteria {
  field: string;
  value: any[];
}

export interface ButtonAction {
  label?: string;
  icon?: string;
  color?: string;
  text_color?: string;
  tooltip?: string;
  action: ACTIONS;
  disabledCriteria?: DisabledButtonCriteria;
}

export interface ResponseExternal<T> {
  status: number;
  error?: string;
  message?: string;
  payload: T | null;
}

export interface Qtree<T> {
  label: string;
  disabled?: boolean;
  children?: Qtree<T>[];
}
