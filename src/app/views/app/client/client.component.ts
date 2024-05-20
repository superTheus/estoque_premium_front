import { Component } from '@angular/core';
import { ApiService } from '../../../data/api.service';
import { Clients } from './client.interface';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { getCompanyId, getPermision } from '../../../utils/util';
import Swal from 'sweetalert2';

declare const $: any;

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss'
})
export class ClientComponent {
  form!: FormGroup;

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

  permissions = getPermision();
  disableNew = false;

  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder,
  ) {

    this.form = this.formBuilder.group({
      name: new FormControl(''),
      apelido: new FormControl(''),
      razao_social: new FormControl(''),
      rg_inscricao: new FormControl(''),
      email: new FormControl(''),
      celular: new FormControl(''),
      telefone: new FormControl(''),
      endereco: new FormControl(''),
      cep: new FormControl(''),
      documento: new FormControl(''),
      cidade: new FormControl(''),
      numero: new FormControl(''),
      bairro: new FormControl(''),
      complemento: new FormControl(''),
      data_nascimento: new FormControl(''),
      icms: new FormControl(''),
      genero: new FormControl(''),
    });

    this.loadClients();
  }

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.apiService.findClient({
      filter: {
        id_company: getCompanyId(),
        deleted: 'N',
        show_client: 'S'
      }
    }).then(res => {
      this.data = res.results;
    })
  }

  loadClients() {
    this.apiService.findClient({
      filter: {
        deleted: 'N',
        show_client: 'S',
        id_company: getCompanyId()
      }
    }).then(res => {
      if (this.permissions?.limite_clientes) {
        this.disableNew = this.permissions?.limite_clientes <= res.results.length ? true : false;
      }
    });
  }

  openModal() {
    this.form.get('name')?.setValue('');
    this.form.get('apelido')?.setValue('');
    this.form.get('razao_social')?.setValue('');
    this.form.get('rg_inscricao')?.setValue('');
    this.form.get('email')?.setValue('');
    this.form.get('celular')?.setValue('');
    this.form.get('telefone')?.setValue('');
    this.form.get('endereco')?.setValue('');
    this.form.get('cep')?.setValue('');
    this.form.get('documento')?.setValue('');
    this.form.get('cidade')?.setValue('');
    this.form.get('numero')?.setValue('');
    this.form.get('bairro')?.setValue('');
    this.form.get('complemento')?.setValue('');
    this.form.get('data_nascimento')?.setValue('');
    this.form.get('icms')?.setValue('');
    this.form.get('genero')?.setValue('');
    this.isEditMode = false;
    $('#modalClient').modal('show');
  }

  save() {
    if (this.isEditMode) {
      this.apiService.updateClient({
        id: this.clientSelected?.id,
        ...this.form.value
      }).then(res => {
        this.load();
        this.loadClients()
      })
    } else {
      this.apiService.createClient({
        ...this.form.value,
        id_company: getCompanyId(),
      }).then(res => {
        this.load();
        this.loadClients()
      })
    }

    $('#modalClient').modal('hide');
  }

  update(client: Clients) {
    this.clientSelected = client;
    this.isEditMode = true;

    this.form.get('name')?.setValue(client.name || '');
    this.form.get('apelido')?.setValue(client.apelido || '');
    this.form.get('razao_social')?.setValue(client.razao_social || '');
    this.form.get('rg_inscricao')?.setValue(client.rg_inscricao || '');
    this.form.get('email')?.setValue(client.email || '');
    this.form.get('celular')?.setValue(client.celular || '');
    this.form.get('telefone')?.setValue(client.telefone || '');
    this.form.get('endereco')?.setValue(client.endereco || '');
    this.form.get('cep')?.setValue(client.cep || '');
    this.form.get('documento')?.setValue(client.documento || '');
    this.form.get('cidade')?.setValue(client.cidade || '');
    this.form.get('numero')?.setValue(client.numero || '');
    this.form.get('bairro')?.setValue(client.bairro || '');
    this.form.get('complemento')?.setValue(client.complemento || '');
    this.form.get('data_nascimento')?.setValue(client.data_nascimento || '');
    this.form.get('icms')?.setValue(client.icms || '');
    this.form.get('genero')?.setValue(client.genero || '');

    $('#modalClient').modal('show');
  }

  delete(client: Clients) {
    Swal.fire({
      title: "Realmente deseja deletar este cliente ?",
      showDenyButton: true,
      confirmButtonText: "Sim Deletar",
      denyButtonText: `Não, cancelar`,
      confirmButtonColor: '#d33',
      denyButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {

        var newClient = { ...client };
        newClient.deleted = 'S';

        this.apiService.updateClient(newClient).then(res => {
          this.load();
          this.loadClients()
          Swal.fire("Cliente deletado", "", "info");
        })

        this.clientSelected = newClient;
      }
    });
  }
}
