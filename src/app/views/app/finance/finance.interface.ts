import { Clients } from "../client/client.interface";

export interface FinanceData {
  id?: number,
  value: string,
  payform: number,
  client: number,
  number_order: string,
  type: string,
  wild: string,
  portion_value: number,
  date_finance: string,
  date_expiration: string,
  observation: string,
  status: string,
  clientData?: Clients,
  company: number,
}

export interface FinanceDataRequest {
  filter?: {
    id?: number,
    value?: string,
    payform?: number,
    client?: number,
    number_order?: string,
    type?: string,
    wild?: string,
    portion_value?: number,
    date_finance?: string,
    date_expiration?: string,
    observation?: string,
    status?: string,
    clientData?: Clients,
    company: number
  };
  limit?: number;
}
