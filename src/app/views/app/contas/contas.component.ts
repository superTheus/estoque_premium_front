import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Contas } from './contas.interface';
import { ApiService } from '../../../data/api.service';
import { Options } from '../../../components/select-default/select-default.interface';
import Swal from 'sweetalert2';

declare var $: any;

@Component({
  selector: 'app-contas',
  templateUrl: './contas.component.html',
  styleUrl: './contas.component.scss'
})
export class ContasComponent {
  descricao = new FormControl('');
  saldo_inicial = new FormControl('');
  tipo_conta = new FormControl('');
  cod_bancario = new FormControl('');
  conta = new FormControl('');
  agencia = new FormControl('');
  isEditMode = false;
  contaSelected?: Contas;
  data: Contas[] = [];

  contasSelect: Options[] = [
    { value: 'C', label: 'Conta Corrente' },
    { value: 'P', label: 'Conta Poupança' },
    { value: 'PA', label: 'Conta Pagamento' }
  ]

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.apiService.findContas({
      filter: {
        deleted: 'N'
      }
    }).then(res => {
      this.data = res.results;

      this.data = this.data.map(conta => {
        let newConta = { ...conta };
        newConta.saldo_inicial = Number(conta.saldo_inicial);
        if (newConta.tipo_conta === 'C') {
          newConta.tipo_conta_descricao = 'Conta Corrente'
        }
        if (newConta.tipo_conta === 'P') {
          newConta.tipo_conta_descricao = 'Conta Poupança'
        }
        if (newConta.tipo_conta === 'PA') {
          newConta.tipo_conta_descricao = 'Conta Pagamento'
        }
        return newConta;
      })

      console.log(this.data);
    })
  }

  save() {
    if (this.isEditMode) {
      this.apiService.updateConta({
        id: this.contaSelected?.id,
        descricao: this.descricao.value ? this.descricao.value : '',
        saldo_inicial: this.saldo_inicial.value ? Number(this.saldo_inicial.value) : 0,
        tipo_conta: this.tipo_conta.value ? this.tipo_conta.value : '',
        cod_bancario: this.cod_bancario.value ? this.cod_bancario.value : '',
        conta: this.conta.value ? this.conta.value : '',
        agencia: this.agencia.value ? this.agencia.value : '',
        id_company: 1
      }).then(res => {
        this.load();
      })
    } else {
      this.apiService.createContas({
        descricao: this.descricao.value ? this.descricao.value : '',
        saldo_inicial: this.saldo_inicial.value ? Number(this.saldo_inicial.value) : 0,
        tipo_conta: this.tipo_conta.value ? this.tipo_conta.value : '',
        cod_bancario: this.cod_bancario.value ? this.cod_bancario.value : '',
        conta: this.conta.value ? this.conta.value : '',
        agencia: this.agencia.value ? this.agencia.value : '',
        id_company: 1
      }).then(res => {
        this.load();
      })
    }

    $('#modalProduct').modal('hide');
  }

  update(conta: Contas) {
    this.contaSelected = conta;
    this.descricao.setValue(conta.descricao || '');
    this.saldo_inicial.setValue(String(conta.saldo_inicial) || '0');
    this.tipo_conta.setValue(conta.tipo_conta || '');
    this.cod_bancario.setValue(conta.cod_bancario || '');
    this.conta.setValue(conta.conta || '');
    this.agencia.setValue(conta.agencia || '');
    this.isEditMode = true;
    $('#modalProduct').modal('show');
  }

  delete(conta: Contas) {
    Swal.fire({
      title: "Realmente deseja deletar esta conta?",
      showDenyButton: true,
      confirmButtonText: "Sim Deletar",
      denyButtonText: `Não, cancelar`,
      confirmButtonColor: '#d33',
      denyButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        var newConta = { ...conta };
        newConta.deleted = 'S';
        this.contaSelected = newConta;

        this.apiService.updateConta(newConta).then(res => {
          this.load();
          Swal.fire("Conta deletada", "", "info");
        })
      }
    });
  }
}
