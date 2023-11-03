import { RecordResponse } from '../record/record.types';

export type DocumentRequest = {
  name: string;
  location: string;
  type: string;
  record: number;
};

export interface DocumentResponse {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  location: string;
  type: string;
  record: RecordResponse;
}
