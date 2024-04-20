import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../data/api.service';
import { Clients } from '../client/client.interface';
import { FormBuilder, FormControl, UntypedFormGroup } from '@angular/forms';
import { Finance } from '../payment/payment.interface';
import { Contas } from '../contas/contas.interface';
import { Options } from '../../../components/select-default/select-default.interface';
import { getCompanyId } from '../../../utils/util';
import { FinanceData } from './finance.interface';

declare const $: any;

@Component({
  selector: 'app-finance',
  templateUrl: './finance.component.html',
  styleUrl: './finance.component.scss'
})
export class FinanceComponent implements OnInit {
  clientForm!: UntypedFormGroup;


  value = new FormControl('');
  payform = new FormControl('');
  client = new FormControl('');
  number_order = new FormControl('');
  type = new FormControl('');
  wild = new FormControl('');
  portion_value = new FormControl('');
  date_finance = new FormControl('');
  date_expiration = new FormControl('');
  observation = new FormControl('');
  status = new FormControl('');

  clients!: Clients[];

  finances: FinanceData[] = [];

  isEditMode = false;
  financeSelected?: Finance;
  data: Finance[] = [];

  totalLate = 0;
  totalDay = 0;

  contas: Options[] = [];
  formPay: Options[] = [
    {
      label: 'Dinheiro',
      value: 1
    },
    {
      label: 'Cartão de Débito',
      value: 2
    },
    {
      label: 'Cartão de Crédito',
      value: 3
    },
    {
      label: 'Pix',
      value: 4
    },
    {
      label: 'Crediário',
      value: 5
    }
  ];
  clientOptions: Options[] = [];

  statu: Options[] = [
    { label: 'Pendente', value: 'PE' },
    { label: 'Pago', value: 'PG' },
    { label: 'Cancelado', value: 'CA' }
  ];

  typeOptions: Options[] = [
    { label: 'Receita', value: 'R' },
    { label: 'Despesa', value: 'D' }
  ]

  wildOptions: Options[] = [
    { label: 'Vendas', value: 'V' },
    { label: 'Compras', value: 'C' }
  ]

  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder
  ) {
    this.clientForm = this.formBuilder.group({
      client: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.apiService.findFinance({
      filter: {
        company: getCompanyId()
      }
    }).then((data) => {
      this.finances = data.results;
      console.log(this.finances);
    });

    this.apiService.findClient().then((data) => {
      this.clients = data.results;
      this.clientOptions = this.clients.map(client => {
        return {
          label: client.name as string,
          value: client.id as number
        }
      });
    });
  }

  save() {
  }

  update(finance: Finance) {
  }

  delete(brand: Finance) {
    var newFinance = { ...brand };
    newFinance.deleted = 'S';
    this.financeSelected = newFinance;

    this.apiService.updateContaFinanceiro(newFinance).then(res => {
      this.load();
    })
  }

  compareDate(finance: Finance[]) {
    this.totalLate = 0;
    this.totalDay = 0;
    finance.forEach(finance => {
      var inputDate = new Date(finance.vencimento as string);
      var today = new Date();
      today.setHours(0, 0, 0, 0);

      if ((inputDate.getTime() < today.getTime()) && (finance.status_pagamento === 'PE')) {
        this.totalLate++;
      };

      if ((inputDate.getTime() === today.getTime()) && (finance.status_pagamento === 'PE')) {
        this.totalDay++;
      }
    });
  }
}
