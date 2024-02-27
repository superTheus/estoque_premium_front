export interface Users {
  id?: number;
  name: string;
  email: string;
  deleted?: 'S' | 'N';
}

export interface UsersRequest {
  filter?: {
    id?: number;
    description?: string;
    deleted?: 'S' | 'N';
  };
  limit?: number;
}
