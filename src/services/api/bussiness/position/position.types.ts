export interface PositionResponse {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
}

export type PositionRequest = {
  name: string;
};
