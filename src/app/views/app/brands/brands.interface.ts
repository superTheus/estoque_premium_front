export interface Brands {
  id?: number;
  id_company?: number;
  description: string;
  deleted?: 'S' | 'N';
}

export interface BrandsRequest {
  filter?: {
    id?: number;
    description?: string;
    deleted?: 'S' | 'N';
  };
  limit?: number;
}
