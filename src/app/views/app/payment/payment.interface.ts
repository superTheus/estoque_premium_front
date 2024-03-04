export interface Finance {
  id?: number;
  documento?: string,
  tipo_conta?: string,
  vencimento?: string,
  descricao?: string,
  valor?: number,
  id_conta?: number,
  id_company?: number,
  status_pagamento?: string,
  deleted?: 'S' | 'N';
}

export interface FinanceRequest {
  filter?: Finance;
  limit?: number;
}
