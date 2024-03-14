import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Finance } from '../payment/payment.interface';
import { Options } from '../../../components/select-default/select-default.interface';
import { ApiService } from '../../../data/api.service';
import { Contas } from '../contas/contas.interface';

declare const $: any;

@Component({
  selector: 'app-receive',
  templateUrl: './receive.component.html',
  styleUrl: './receive.component.scss'
})
export class ReceiveComponent {
  documento = new FormControl('');
  vencimento = new FormControl('');
  descricao = new FormControl('');
  valor = new FormControl('');
  id_conta = new FormControl('');
  status_pagamento = new FormControl('');
  isEditMode = false;
  financeSelected?: Finance;
  data: Finance[] = [];

  totalLate = 0;
  totalDay = 0;

  contas: Options[] = [];

  statu: Options[] = [
    { label: 'Pendente', value: 'PE' },
    { label: 'Pago', value: 'PG' },
    { label: 'Cancelado', value: 'CA' }
  ];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.apiService.findContasFinanceiro({
      filter: {
        tipo_conta: "R",
        deleted: 'N'
      }
    }).then(res => {
      console.log(res.results);
      this.data = res.results;
      this.compareDate(this.data);
    })

    this.apiService.findContas({
      filter: {
        deleted: 'N'
      }
    }).then(res => {
      this.contas = res.results.map((conta: Contas) => {
        return {
          label: conta.descricao,
          value: conta.id
        }
      });
    })
  }

  save() {
    if (this.isEditMode) {
      this.apiService.updateContaFinanceiro({
        id: this.financeSelected?.id,
        descricao: this.descricao.value ? this.descricao.value : '',
        documento: this.documento.value ? this.documento.value : '',
        tipo_conta: this.financeSelected?.tipo_conta,
        vencimento: this.vencimento.value ? this.vencimento.value : '',
        valor: this.valor.value ? Number(this.valor.value) : 0,
        id_conta: this.id_conta.value ? Number(this.id_conta.value) : 0,
        status_pagamento: this.status_pagamento.value ? this.status_pagamento.value : 'PE',
        deleted: this.financeSelected?.deleted
      }).then(res => {
        this.load();
        this.updateAccount()
      })
    } else {
      this.apiService.createContasFinanceiro({
        descricao: this.descricao.value ? this.descricao.value : '',
        documento: this.documento.value ? this.documento.value : '',
        tipo_conta: 'R',
        vencimento: this.vencimento.value ? this.vencimento.value : '',
        valor: this.valor.value ? Number(this.valor.value) : 0,
        id_conta: this.id_conta.value ? Number(this.id_conta.value) : 0,
        status_pagamento: this.status_pagamento.value ? this.status_pagamento.value : 'PE',
        id_company: 1
      }).then(res => {
        this.load();
        this.updateAccount()
      })
    }

    $('#modalProduct').modal('hide');
  }

  update(finance: Finance) {
    this.financeSelected = finance;
    this.descricao.setValue(finance.descricao || '');
    this.documento.setValue(finance.documento || '');
    this.vencimento.setValue(finance.vencimento || '');
    this.valor.setValue(String(finance.valor));
    this.id_conta.setValue(String(finance.id_conta));
    this.status_pagamento.setValue(finance.status_pagamento || 'PE');
    this.isEditMode = true;
    $('#modalProduct').modal('show');
  }

  updateAccount() {
    if (this.status_pagamento.value === 'PG') {
      this.apiService.findContas({
        filter: {
          id: Number(this.id_conta.value),
        }
      }).then((data) => {
        const currentAccount: Contas = data.results[0]
        currentAccount.saldo_inicial = Number(currentAccount.saldo_inicial) + Number(this.valor.value);
        this.apiService.updateConta(currentAccount).then(data => console.log(data));
      });
    }
  }

  delete(brand: Finance) {
    var newFinance = { ...brand };
    newFinance.deleted = 'S';
    this.financeSelected = newFinance;

    this.apiService.updateContaFinanceiro(newFinance).then(res => {
      this.load();
    })
  }

  formatDate(date: string) {
    var dateParts = date.split('-');
    return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
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
