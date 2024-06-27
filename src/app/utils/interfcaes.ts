export interface CestInterface {
  cest_id: string,
  ncm_id: string,
  descricao: string
}

export interface IbptInterface {
  codigo: string,
  nacional: string,
  importado: string
}

export interface NcmInterface {
  id: number,
  codigo: string,
  descricao: string,
}

export interface SituacaoTributariaInterface {
  id: number,
  codigo: string,
  descricao: string,
  regime: string
}

export interface CfopInterface {
  id: string,
  descricao: string,
  aplicacao: string
}

export interface FormasPagamentoInterface {
  codigo: number,
  descricao: string,
  cod_meio: string,
  meio: string
}

export interface CompanyFiscalInterface {
  id?: number,
  cnpj: string,
  razao_social: string;
  nome_fantasia: string;
  telefone: string;
  email: string;
  cep: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  codigo_municipio: string;
  uf: string;
  codigo_uf: string;
  cnae?: string;
  inscricao_estadual: string,
  inscricao_municipal?: string,
  atividade?: string,
  certificado: string,
  senha: string,
  csc: string,
  csc_id: string,
  serie_nfce: string,
  numero_nfce: string,
  serie_nfe: string,
  numero_nfe: string,
  situacao_tributaria: string,
  dados_certificado?: any
}
