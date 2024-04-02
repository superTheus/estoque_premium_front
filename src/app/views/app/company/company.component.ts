import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ApiService } from '../../../data/api.service';
import { getCompanyId } from '../../../utils/util';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrl: './company.component.scss'
})
export class CompanyComponent implements OnInit {
  cnpj = new FormControl('');
  razao_social = new FormControl('');
  nome_fantasia = new FormControl('');
  telefone = new FormControl('');
  email = new FormControl('');
  cep = new FormControl('');
  logradouro = new FormControl('');
  numero = new FormControl('');
  bairro = new FormControl('');
  cidade = new FormControl('');
  uf = new FormControl('');

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.apiService.findCompany({
      filter: {
        id: getCompanyId()
      }
    }).then((company) => {
      const data = company.results[0];

      this.cnpj.setValue(data.cnpj);
      this.razao_social.setValue(data.razao_social);
      this.nome_fantasia.setValue(data.nome_fantasia);
      this.telefone.setValue(data.telefone);
      this.email.setValue(data.email);
      this.cep.setValue(data.cep);
      this.logradouro.setValue(data.logradouro);
      this.numero.setValue(data.numero);
      this.bairro.setValue(data.bairro);
      this.cidade.setValue(data.cidade);
      this.uf.setValue(data.uf);
    })
  }

  save() {
    this.apiService.updateCompany({
      id: getCompanyId(),
      cnpj: this.cnpj.value || '',
      razao_social: this.razao_social.value || '',
      nome_fantasia: this.nome_fantasia.value || '',
      telefone: this.telefone.value || '',
      email: this.email.value || '',
      cep: this.cep.value || '',
      logradouro: this.logradouro.value || '',
      numero: Number(this.numero.value) || 0,
      bairro: this.bairro.value || '',
      cidade: this.cidade.value || '',
      uf: this.uf.value || ''
    }).then(() => {
      Swal.fire({
        title: 'Sucesso!',
        text: 'Empresa atualizada com sucesso.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    });
  }
}
