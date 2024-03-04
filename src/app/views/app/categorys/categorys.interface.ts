export interface Categorys {
  id?: number;
  id_company?: number;
  description: string;
  deleted?: 'S' | 'N';
}

export interface CategorysRequest {
  filter?: {
    id?: number;
    description?: string;
    deleted?: 'S' | 'N';
  };
  limit?: number;
}
