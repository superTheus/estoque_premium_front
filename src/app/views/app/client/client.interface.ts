export interface Clients {
  id?: number;
  id_company?: number;
  nome?: string,
  apelido?: string,
  razao_social?: string,
  rg_inscricao?: string,
  email?: string,
  celular?: string,
  cep?: string,
  endereco?: string,
  documento?: string,
  cidade?: string,
  numero?: string,
  bairro?: string,
  complemento?: string,
  data_nascimento?: string,
  icms?: string,
  genero?: string
  deleted?: string,
  telefone?: string
}


export interface ClientsRequest {
  filter?: Clients;
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
