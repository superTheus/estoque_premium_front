export interface Users {
  id?: number;
  name: string;
  email: string;
  password: string;
  ativo?: 'S' | 'N';
}

export interface UsersRequest {
  filter?: {
    id?: number;
    description?: string;
    ativo?: 'S' | 'N';
  };
  limit?: number;
}
