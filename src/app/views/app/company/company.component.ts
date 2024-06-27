import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService, states } from '../../../data/api.service';
import { getCompanyId } from '../../../utils/util';

import { MenuItem, MessageService } from 'primeng/api';
import { UtilsService } from '../../../shared/utils.service';
import { Options } from '../../../components/select-default/select-default.interface';
import { FileSelectEvent, FileUpload, UploadEvent } from 'primeng/fileupload';
import Swal from 'sweetalert2';
import { FiscalService } from '../../../data/fiscal.service';
import { CompanyFiscalInterface } from '../../../utils/interfcaes';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrl: './company.component.scss'
})
export class CompanyComponent implements OnInit {

  companyFiscal!: CompanyFiscalInterface;

  form: FormGroup = this.formBuilder.group({
    cnpj: new FormControl('', [Validators.required]),
    razao_social: new FormControl('', [Validators.required]),
    nome_fantasia: new FormControl('', [Validators.required]),
    inscricao_estadual: new FormControl('', [Validators.required]),
    inscricao_municipal: new FormControl(''),
    telefone: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    cep: new FormControl('', [Validators.required]),
    logradouro: new FormControl('', [Validators.required]),
    numero: new FormControl('', [Validators.required]),
    bairro: new FormControl('', [Validators.required]),
    cidade: new FormControl('', [Validators.required]),
    uf: new FormControl('', [Validators.required]),
    certificate: new FormControl('', [Validators.required]),
    cetificate_name: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    csc: new FormControl('', [Validators.required]),
    csc_id: new FormControl('', [Validators.required]),
    serie_nfce: new FormControl(''),
    numero_nfce: new FormControl(''),
    serie_nfe: new FormControl(''),
    numero_nfe: new FormControl(''),
    situacao_tributaria: new FormControl<Options | null>(null, [Validators.required]),
  });

  estados: states[] = [];
  municipios: states[] = [];

  estadosSelected: Options[] = [];
  citySelected: Options[] = [];
  situacaoTributariaSelected: Options[] = [];

  estadoSelected = new FormControl<Options | null>(null);
  cidadeSelected = new FormControl<Options | null>(null);
  situacaoTributariaSelect = new FormControl<Options | null | undefined>(null);


  fileCertificate!: File | null;
  fileCertificateName: string = '';
  fileCertificateBase64!: string | null;
  files!: File[];

  constructor(
    private apiService: ApiService,
    private fiscalService: FiscalService,
    private formBuilder: FormBuilder,
    public utilsService: UtilsService,
  ) { }

  items: MenuItem[] | undefined;
  tabs: { title: string, content: string }[] = [];


  ngOnInit() {
    this.items = [{ icon: 'pi pi-home', route: '/app' }, { label: 'Empresa' }];

    this.apiService.findCompany({
      filter: {
        id: getCompanyId()
      }
    }).then((company) => {

      const data = company.results[0];
      this.form.get('cnpj')?.setValue(this.utilsService.formatDocument(data.cnpj));
      this.form.get('razao_social')?.setValue(data.razao_social);
      this.form.get('nome_fantasia')?.setValue(data.nome_fantasia);
      this.form.get('telefone')?.setValue(this.utilsService.formatPhoneNumber(data.telefone));
      this.form.get('email')?.setValue(data.email);
      this.form.get('cep')?.setValue(data.cep);
      this.form.get('logradouro')?.setValue(data.logradouro);
      this.form.get('numero')?.setValue(data.numero);
      this.form.get('bairro')?.setValue(data.bairro);
      this.form.get('cidade')?.setValue(data.cidade);
      this.form.get('uf')?.setValue(data.uf);
      this.form.get('cetificate_name')?.setValue(data.cetificate_name);
      this.form.get('certificate')?.setValue(data.certificate);
      this.form.get('password')?.setValue(data.password);
      this.form.get('csc')?.setValue(data.csc);
      this.form.get('csc_id')?.setValue(data.csc_id);
      this.form.get('inscricao_estadual')?.setValue(data.inscricao_estadual);

      this.fileCertificateBase64 = data.certificate;
      this.fileCertificateName = data.cetificate_name as string;

      this.apiService.getStates().then((estados) => {
        this.estados = estados;

        this.estadosSelected = estados.map((estado) => {
          return {
            value: estado.uf,
            label: estado.nome
          };
        });

        let curretEstado = this.estadosSelected.find((estado) => estado.value === data.uf);
        if (curretEstado) {
          this.estadoSelected.setValue(curretEstado);
          this.selectEstado(data.cidade);
        }
      })

      this.fiscalService.listCompanyFiscal({
        cnpj: UtilsService.extractNumbersFromString(data.cnpj)
      }).then(data => {
        this.companyFiscal = data[0];

        this.fiscalService.listSituacaoTributaria().then((situacaoTributaria) => {
          this.situacaoTributariaSelected = situacaoTributaria.map((situacaoTributaria) => {
            return {
              value: situacaoTributaria.codigo,
              label: situacaoTributaria.descricao
            };
          });

          this.situacaoTributariaSelect.setValue(this.situacaoTributariaSelected.find((situacaoTributaria) => situacaoTributaria.value === this.companyFiscal?.situacao_tributaria) || this.situacaoTributariaSelected.find((situacaoTributaria) => situacaoTributaria.value === '102'));
          this.form.get('situacao_tributaria')?.setValue(this.situacaoTributariaSelect.value?.value);
          this.form.get('serie_nfce')?.setValue(this.companyFiscal?.serie_nfce);
          this.form.get('numero_nfce')?.setValue(this.companyFiscal?.numero_nfce);
          this.form.get('serie_nfe')?.setValue(this.companyFiscal?.serie_nfe);
          this.form.get('numero_nfe')?.setValue(this.companyFiscal?.numero_nfe);
        });
      })
    })
  }

  async save() {
    if (this.form.invalid) {
      Swal.fire({
        position: "top-end",
        icon: 'error',
        title: 'Oops...',
        text: 'Por favor preenchas todos os campos obrigatórios',
        timer: 3000,
        showConfirmButton: false
      });
      return;
    }

    let testCertificate = await this.testCertificate(false);

    if (testCertificate) {
      this.apiService.updateCompany({
        id: getCompanyId(),
        ...this.form.value
      }).then((res) => {
        if (this.companyFiscal) {

        } else {
          this.fiscalService.createCompanyFiscal({
            cnpj: UtilsService.extractNumbersFromString(this.form.get('cnpj')?.value as string),
            razao_social: this.form.get('razao_social')?.value as string,
            nome_fantasia: this.form.get('nome_fantasia')?.value as string,
            telefone: UtilsService.extractNumbersFromString(this.form.get('telefone')?.value as string),
            email: this.form.get('email')?.value as string,
            cep: this.form.get('cep')?.value as string,
            logradouro: this.form.get('logradouro')?.value as string,
            numero: this.form.get('numero')?.value as string,
            bairro: this.form.get('bairro')?.value as string,
            cidade: this.form.get('cidade')?.value as string,
            uf: this.form.get('uf')?.value as string,
            inscricao_estadual: this.form.get('inscricao_estadual')?.value as string,
            certificado: this.form.get('certificate')?.value as string,
            senha: this.form.get('password')?.value as string,
            csc: this.form.get('csc')?.value as string,
            csc_id: this.form.get('csc_id')?.value as string,
            codigo_municipio: this.municipios.find((municipio) => municipio.nome.toLowerCase() === this.form.get('cidade')?.value.toLowerCase())?.codigo || '',
            codigo_uf: this.estados.find((estado) => estado.uf === this.form.get('uf')?.value)?.codigo || '',
            numero_nfce: this.form.get('numero_nfce')?.value as string,
            numero_nfe: this.form.get('numero_nfe')?.value as string,
            serie_nfce: this.form.get('serie_nfce')?.value as string,
            serie_nfe: this.form.get('serie_nfe')?.value as string,
            situacao_tributaria: this.form.get('situacao_tributaria')?.value as string
          }).then((res) => {
            Swal.fire({
              position: "top-end",
              icon: 'success',
              title: 'Sucesso',
              text: 'Empresa atualizada com sucesso',
              timer: 2000,
              showConfirmButton: false
            })
          }).catch((err) => {
            Swal.fire({
              position: "top-end",
              icon: 'error',
              title: 'Oops...',
              text: err.error.error,
              timer: 3000,
            })
          });
        }
      });
    }
  }

  selectEstado(selected?: string) {
    this.form.get('uf')?.setValue(this.estadoSelected.value?.value);
    this.apiService.getCitys(this.estadoSelected.value?.value as string).then((cidade) => {
      this.municipios = cidade;
      this.citySelected = cidade.map((cidade) => {
        return {
          value: cidade.nome,
          label: cidade.nome
        };
      });

      if (selected) {
        let currentCidade = this.citySelected.find((cidade) => String(cidade.value).toUpperCase() === selected.toUpperCase());
        if (currentCidade) {
          this.cidadeSelected.setValue(currentCidade);
        }
      }
    })
  }

  selectSistuacao() {
    this.form.get('situacao_tributaria')?.setValue(this.situacaoTributariaSelect.value);

    console.log(this.form.get('situacao_tributaria')?.value)
  }

  onFileSelect(event: FileSelectEvent, uploader: FileUpload) {
    const file = event.currentFiles[0];
    const acceptedExtensions = ['pfx'];
    const extension = file.name.split('.').pop()?.toLowerCase();

    if (extension && acceptedExtensions.includes(extension)) {
      this.fileCertificate = file;
      this.fileCertificateName = file.name;
      const reader = new FileReader();
      reader.onload = (loadEvent: ProgressEvent<FileReader>) => {
        const base64String = loadEvent.target?.result as string;
        const base64 = base64String.split(',')[1];
        this.fileCertificateBase64 = base64;
        this.form.get('certificate')?.setValue(this.fileCertificateBase64);
      };
      reader.readAsDataURL(file);
    } else {
      uploader.clear();
      Swal.fire({
        position: "top-end",
        icon: 'error',
        title: 'Oops...',
        text: 'Este não é um certificado válido',
        timer: 2000,
        showConfirmButton: false
      });
    }

    uploader.clear();
  }

  clearCertificate() {
    this.fileCertificate = null;
    this.fileCertificateName = '';
    this.fileCertificateBase64 = null;
  }

  async testCertificate(showPositiveMessage: boolean = true, showNegativeMessage: boolean = true) {

    if (!this.fileCertificateBase64) {
      if (showNegativeMessage) {
        Swal.fire({
          position: "top-end",
          icon: 'error',
          title: 'Oops...',
          text: 'Selecione um certificado',
          timer: 2000,
          showConfirmButton: false
        });
      }

      return false;
    }

    if (!this.form.get('password')?.value) {
      if (showNegativeMessage) {
        Swal.fire({
          position: "top-end",
          icon: 'error',
          title: 'Oops...',
          text: 'Digite a senha do certificado',
          timer: 2000,
          showConfirmButton: false
        });
      }

      return false;
    }

    let res = await this.fiscalService.testCertificate({
      certificado: this.fileCertificateBase64 as string,
      senha: this.form.get('password')?.value as string
    });

    if (res.sucesso) {
      if (showPositiveMessage) {
        Swal.fire({
          position: "center",
          icon: 'success',
          title: 'Tudo certo',
          text: res.mensagem,
          timer: 2000,
          showConfirmButton: false
        });
      }

      return true;
    } else {
      if (showNegativeMessage) {
        Swal.fire({
          position: "center",
          icon: 'error',
          title: 'Oops...',
          text: res.mensagem,
          timer: 2000,
          showConfirmButton: false
        });
      }

      return false;
    }
  }
}
