export interface DepartmentResponse {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
}

export type DepartmentRequest = {
  name: string;
};
