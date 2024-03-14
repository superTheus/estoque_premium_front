export interface Box {
  id?: number;
  id_company?: number;
  id_user?: number;
  value_init?: number;
  value_final?: number;
  status?: 'AB' | 'FE';
}

export interface BoxRequest {
  filter?: Box;
  limit?: number;
}
