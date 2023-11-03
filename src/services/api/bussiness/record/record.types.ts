import { DepartmentResponse } from '../department/department.types';
import { EmployeeResponse } from '../employee/employee.types';
import { PositionResponse } from '../position/position.types';

export interface RecordResponse {
  id: number;
  createdAt: string;
  updatedAt: string;
  employee: EmployeeResponse;
  departament: DepartmentResponse;
  position: PositionResponse;
  assessment: string;
  salary: number;
  comment: string;
}

export type RecordRequest = {
  employee: number;
  department: number;
  position: number;
  assessment: string;
  salary: number;
  comment: string;
};
