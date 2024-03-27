import { Component } from '@angular/core';
import { ApiService } from '../../../data/api.service';
import { Clients } from './client.interface';
import { FormControl } from '@angular/forms';
import { getCompanyId } from '../../../utils/util';

declare const $: any;

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss'
})
export class ClientComponent {
  nome = new FormControl('');
  apelido = new FormControl('');
  razao_social = new FormControl('');
  rg_inscricao = new FormControl('');
  email = new FormControl('');
  celular = new FormControl('');
  telefone = new FormControl('');
  endereco = new FormControl('');
  cep = new FormControl('');
  documento = new FormControl('');
  cidade = new FormControl('');
  numero = new FormControl('');
  bairro = new FormControl('');
  complemento = new FormControl('');
  data_nascimento = new FormControl('');
  icms = new FormControl('');
  genero = new FormControl('');

  generoOptions: {
    value: string;
    label: string;
  }[] = [
      {
        label: 'Masculino',
        value: 'M'
      },
      {
        label: 'Feminino',
        value: 'F'
      },
      {
        label: 'Outros',
        value: 'O'
      }
    ]

  isEditMode = false;
  clientSelected: Clients | undefined;
  data: Clients[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.apiService.findClient({
      filter: {
        id_company: getCompanyId(),
        deleted: 'N'
      }
    }).then(res => {
      this.data = res.results;
    })
  }

  save() {
    if (this.isEditMode) {
      this.apiService.updateClient({
        id: this.clientSelected?.id,
        apelido: this.apelido.value || '',
        bairro: this.bairro.value || '',
        celular: this.celular.value || '',
        cep: this.cep.value || '',
        cidade: this.cidade.value || '',
        complemento: this.complemento.value || '',
        data_nascimento: this.data_nascimento.value || '',
        documento: this.documento.value || '',
        email: this.email.value || '',
        endereco: this.endereco.value || '',
        genero: this.genero.value || '',
        icms: this.icms.value || '',
        nome: this.nome.value || '',
        numero: this.numero.value || '',
        razao_social: this.razao_social.value || '',
        rg_inscricao: this.rg_inscricao.value || '',
        telefone: this.telefone.value || ''
      }).then(res => {
        console.log(res);
        this.load();
      })
    } else {
      this.apiService.createClient({
        apelido: this.apelido.value || '',
        bairro: this.bairro.value || '',
        celular: this.celular.value || '',
        cep: this.cep.value || '',
        cidade: this.cidade.value || '',
        complemento: this.complemento.value || '',
        data_nascimento: this.data_nascimento.value || '',
        documento: this.documento.value || '',
        email: this.email.value || '',
        endereco: this.endereco.value || '',
        genero: this.genero.value || '',
        icms: this.icms.value || '',
        nome: this.nome.value || '',
        numero: this.numero.value || '',
        razao_social: this.razao_social.value || '',
        rg_inscricao: this.rg_inscricao.value || '',
        telefone: this.telefone.value || '',
        id_company: 1,
      }).then(res => {
        console.log(res);
        this.load();
      })
    }

    $('#modalProduct').modal('hide');
  }

  update(client: Clients) {
    this.clientSelected = client;
    this.isEditMode = true;

    this.nome.setValue(client.nome || '');
    this.apelido.setValue(client.apelido || '');
    this.razao_social.setValue(client.razao_social || '');
    this.rg_inscricao.setValue(client.rg_inscricao || '');
    this.email.setValue(client.email || '');
    this.celular.setValue(client.celular || '');
    this.telefone.setValue(client.telefone || '');
    this.endereco.setValue(client.endereco || '');
    this.cep.setValue(client.cep || '');
    this.documento.setValue(client.documento || '');
    this.cidade.setValue(client.cidade || '');
    this.numero.setValue(client.numero || '');
    this.bairro.setValue(client.bairro || '');
    this.complemento.setValue(client.complemento || '');
    this.data_nascimento.setValue(client.data_nascimento || '');
    this.icms.setValue(client.icms || '');
    this.genero.setValue(client.genero || '');

    $('#modalProduct').modal('show');
  }

  delete(client: Clients) {
    var newClient = { ...client };
    newClient.deleted = 'S';

    this.apiService.updateClient(newClient).then(res => {
      console.log(res);
      this.load();
    })

    this.clientSelected = newClient;
  }
}
