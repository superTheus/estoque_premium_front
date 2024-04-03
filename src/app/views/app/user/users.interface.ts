export interface Users {
  id?: number;
  name?: string;
  email?: string;
  password?: string;
  profile?: 'ADMIN' | 'STORE';
  use_system?: 'Y' | 'N';
  ativo?: 'S' | 'N';
  company?: number;
}

export interface UsersRequest {
  filter?: Users;
  limit?: number;
}
