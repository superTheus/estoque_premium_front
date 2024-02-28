export interface Suppliers {
  id?: number;
  name?: string;
  document?: string;
  id_company?: number;
  deleted?: 'S' | 'N';
}

export interface SuppliersRequest {
  filter?: {
    id?: number;
    name?: string;
    document?: string;
    id_company?: number;
    deleted?: 'S' | 'N';
  };
  limit?: number;
}
