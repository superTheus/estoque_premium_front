export interface Contas {
  id?: number,
  id_company?: number,
  descricao?: string,
  saldo_inicial?: number,
  tipo_conta?: string,
  tipo_conta_descricao?: string,
  cod_bancario?: string,
  conta?: string,
  agencia?: string,
  deleted?: `S` | `N`
}

export interface ContasRequest {
  filter?: Contas;
  limit?: number;
}
