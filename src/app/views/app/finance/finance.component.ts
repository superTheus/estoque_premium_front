import { Component, OnInit } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { FormBuilder, FormControl, UntypedFormGroup } from '@angular/forms';

import { ApiService } from '../../../data/api.service';
import { Clients } from '../client/client.interface';
import { Finance } from '../payment/payment.interface';
import { Options } from '../../../components/select-default/select-default.interface';
import { getCompanyId } from '../../../utils/util';
import { FinanceData } from './finance.interface';
import Swal from 'sweetalert2';

declare const $: any;

interface PaymentForms {
  id: number;
  label: 'DINHEIRO' | 'CARTÃO DE DÉBITO' | 'CARTÃO DE CRÉDITO' | 'PIX' | 'CREDIÁRIO';
  value: number;
  icon: 'far fa-credit-card' | 'far fa-money-bill-alt' | 'far fa-credit-card' | 'fas fa-qrcode';
  class: 'bg-success' | 'bg-primary' | 'bg-secondary' | 'bg-danger';
  date?: string;
}

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

  date_init = new FormControl((new Date((new Date).getFullYear(), (new Date).getMonth(), 1)).toISOString().split('T')[0]);
  date_end = new FormControl((new Date()).toISOString().split('T')[0]);

  formpay = new FormControl('');
  status_pay = new FormControl('');

  paymentValue = new FormControl();
  paymentType = new FormControl(1)
  datePay = new FormControl((new Date()).toISOString().split('T')[0])

  payForms: Options[] = [
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
  ]

  statusOptions: Options[] = [
    {
      label: 'Pendente',
      value: 'PE'
    },
    {
      label: 'Pago',
      value: 'PG'
    },
    {
      label: 'Cancelado',
      value: 'CA'
    }
  ]

  clients!: Clients[];

  finances: FinanceData[] = [];

  isEditMode = false;
  financeSelected?: FinanceData;
  data: Finance[] = [];

  totalLate = 0;
  totalDay = 0;

  paymentSelected!: | 1 | 2 | 3 | 4;
  paymentForms: PaymentForms[] = [];

  total = 0;
  totalPayment = 0;
  troco = 0;

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

  paymentTypeOptions: Options[] = [
    {
      label: 'DINHEIRO',
      value: 1
    },
    {
      label: 'DÉBITO',
      value: 2
    },
    {
      label: 'CRÉDITO',
      value: 3
    },
    {
      label: 'PIX',
      value: 4
    }
  ]

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
    this.apiService.findClient({
      filter: {
        id_company: getCompanyId()
      }
    }).then((data) => {
      this.clients = data.results;
      this.clientOptions = this.clients.map(client => {
        return {
          label: client.name as string,
          value: client.id as number
        }
      });
    });

    this.loadFinaces();
  }

  loadFinaces() {
    var where = "";
    let filter: any = {
      company: getCompanyId(),
      deleted: 'N'
    }

    if (this.clientForm.get('client')?.value) {
      filter.client = Number(this.clientForm.get('client')?.value);
    }

    if (this.formpay.value) {
      filter.payform = Number(this.formpay.value);
    }

    if (this.status_pay.value) {
      filter.status = this.status_pay.value;
    }

    if (this.date_init.value && this.date_end.value) {
      where = "date_expiration BETWEEN DATE('" + this.date_init.value + "') AND DATE('" + this.date_end.value + "')"
    }

    this.apiService.findFinance({
      filter: filter,
      where: where,
      limit: 30
    }).then((data) => {
      this.finances = data.results;

      console.log(this.finances);
    }).catch((error) => {
      this.finances = [];
    });
  }

  closeModal = () => {
    $('#modalFinance').modal('hide');
  }

  save() {
    if (this.isEditMode) {
      let finance: FinanceData = {
        id: this.financeSelected?.id,
        client: Number(this.client.value),
        company: getCompanyId(),
        date_expiration: this.date_expiration.value as string,
        date_finance: this.date_finance.value as string,
        number_order: this.number_order.value as string,
        observation: this.observation.value as string,
        payform: Number(this.payform.value),
        portion_value: Number(this.portion_value.value),
        status: this.status.value as string,
        type: this.type.value as string,
        value: Number(this.value.value?.replace('R$', '').replace('.', '').replace(',', '.').trim()),
        wild: this.wild.value as string,
        deleted: 'N',
      }

      this.apiService.updateFinance(finance).then(res => {
        this.load();
        this.closeModal();
        this.isEditMode = false;
      });
    } else {
      let finance: FinanceData = {
        client: Number(this.client.value),
        company: getCompanyId(),
        date_expiration: this.date_expiration.value as string,
        date_finance: this.date_finance.value as string,
        number_order: this.number_order.value as string,
        observation: this.observation.value as string,
        payform: Number(this.payform.value),
        portion_value: Number(this.portion_value.value),
        status: this.financeSelected?.status as string,
        type: this.type.value as string,
        value: Number(this.value.value?.replace('R$', '').replace('.', '').replace(',', '.').trim()),
        wild: this.wild.value as string
      }

      this.apiService.createFinance(finance).then(res => {
        this.load();
        this.closeModal();
      });
    }
  }

  update(finance: FinanceData) {
    this.value.setValue(this.formatValueCurrency(finance.value));
    this.payform.setValue(String(finance.payform));
    this.client.setValue(String(finance.client));
    this.number_order.setValue(finance.number_order);
    this.type.setValue(finance.type);
    this.wild.setValue(finance.wild);
    this.portion_value.setValue(String(finance.portion_value));
    this.date_finance.setValue(finance.date_finance);
    this.date_expiration.setValue(finance.date_expiration);
    this.observation.setValue(finance.observation);
    this.status.setValue(finance.status);
    this.isEditMode = true;
    this.financeSelected = finance;
    $('#modalFinance').modal('show');
  }

  delete(finance: FinanceData) {
    Swal.fire({
      title: "Realmente deseja deletar esta conta?",
      showDenyButton: true,
      confirmButtonText: "Sim Deletar",
      denyButtonText: `Não, cancelar`,
      confirmButtonColor: '#d33',
      denyButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        var newFinance = { ...finance };
        newFinance.deleted = 'S';
        this.financeSelected = newFinance;

        this.apiService.updateFinance(newFinance).then(res => {
          this.load();
          Swal.fire("Conta deletada", "", "info");
        })
      }
    });
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

  formatValueCurrency(value: string | number) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value));
  }

  changeValueFormat() {
    let value: any = this.value.value;

    if (value) {
      value = value.replace(/[^0-9]/g, '')
      value = value.replace('.', '').replace(',', '.');
      value = Number(value) / 100;
      value = this.formatValueCurrency(value);
      this.value.setValue(value);
    }
  }

  applyPayment() {
    let value = Number(this.paymentValue.value.replace('R$', '').replace('.', '').replace(',', '.').trim());
    let form = Number(this.paymentType.value);

    if (form !== 1 && value > (this.total - this.totalPayment)) {
      alert('O valor do pagamento não pode ser maior que o valor total da venda!');
      return;
    }

    if (form === 1 && value > (this.total - this.totalPayment)) {
      this.troco = value - (this.total - this.totalPayment);
    }

    switch (form) {
      case 1:
        this.paymentForms.push({
          id: 1,
          label: 'DINHEIRO',
          value: value,
          icon: 'far fa-money-bill-alt',
          class: 'bg-success',
          date: this.datePay.value as string
        });
        break;
      case 2:
        this.paymentForms.push({
          id: 2,
          label: 'CARTÃO DE DÉBITO',
          value: value,
          icon: 'far fa-credit-card',
          class: 'bg-primary',
          date: this.datePay.value as string
        });
        break;
      case 3:
        this.paymentForms.push({
          id: 3,
          label: 'CARTÃO DE CRÉDITO',
          value: value,
          icon: 'far fa-credit-card',
          class: 'bg-secondary',
          date: this.datePay.value as string
        });
        break;
      case 4:
        this.paymentForms.push({
          id: 4,
          label: 'PIX',
          value: value,
          icon: 'fas fa-qrcode',
          class: 'bg-danger',
          date: this.datePay.value as string
        });
        break;
      case 5:
        this.paymentForms.push({
          id: 5,
          label: 'CREDIÁRIO',
          value: value,
          icon: 'fas fa-qrcode',
          class: 'bg-danger',
          date: this.datePay.value as string
        });
        break;
    }

    this.totalPayment += value;
    this.paymentValue.setValue(this.formatValueCurrency(this.total - this.totalPayment));
  }

  deletPaymentForm(payment: PaymentForms) {
    this.paymentForms = this.paymentForms.filter(item => item.id !== payment.id);
    this.totalPayment -= payment.value;
    this.troco = this.totalPayment - this.total;

    if (this.troco < 0) {
      this.troco = 0;
    }

    this.paymentValue.setValue(this.formatValueCurrency(this.total - this.totalPayment));
  }

  payment(conta: FinanceData) {
    this.financeSelected = conta;
    this.total = conta.value;
    this.totalPayment = 0;

    this.paymentType.setValue(conta.payform);
    this.paymentValue.setValue(this.formatValueCurrency(conta.value));

    $('#modalPayment').modal('show');
  }

  finishedFinance() {
    this.financeSelected!.status = 'PG';
    this.financeSelected!.payments = this.paymentForms.map(payment => {
      return {
        form: Number(payment.id),
        conta: Number(this.financeSelected!.id),
        date: payment.date as string
      }
    })

    this.apiService.updateFinance(this.financeSelected!).then(res => {
      this.load();
      $('#modalPayment').modal('hide');
    });
  }
}
