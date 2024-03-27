import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { ApiService } from '../../../data/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  userName = new FormControl('');
  userPassword = new FormControl('');
  userEmail = new FormControl('');

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

  step = 1;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
  }

  nextStep() {
    this.step++;
  }

  previewStep() {
    this.step--;
  }

  save() {
    this.apiService.createCompany({
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
    }).then((data) => {
      this.apiService.createUser({
        company: data.results.id,
        name: this.userName.value || '',
        email: this.userEmail.value || '',
        password: this.userPassword.value || ''
      }).then(() => {
        Swal.fire({
          title: 'Sucesso',
          text: 'Usuário e Empresa cadastrados com sucesso',
          icon: 'success',
          confirmButtonText: 'Ok'
        }).then(() => {
          window.location.href = '/user/login';
        });
      });
    });
  }
}
