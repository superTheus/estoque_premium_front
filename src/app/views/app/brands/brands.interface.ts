export interface Brands {
  id?: number;
  description: string;
  deleted?: 'S' | 'N';
}

export interface Categorys {
  id?: number;
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

export interface CategorysRequest {
  filter?: {
    id?: number;
    description?: string;
    deleted?: 'S' | 'N';
  };
  limit?: number;
}
