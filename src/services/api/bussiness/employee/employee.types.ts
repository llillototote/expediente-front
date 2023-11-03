export interface EmployeeResponse {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  lastName: string;
  dateBirtday: string;
  address: string;
  phone: string;
  email: string;
}

export type EmployeeRequest = {
  name: string;
  lastName: string;
  dateBirtday: string;
  address: string;
  phone: string;
  email: string;
};
