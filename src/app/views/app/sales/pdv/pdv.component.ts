import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import moment from 'moment';

import { Options } from '../../../../components/select-default/select-default.interface';
import { ApiService } from '../../../../data/api.service';
import { Products } from '../../product/product.interface';
import { SalesService } from '../../../../data/sales.service';
import { SaleProduct, Sales } from '../sales.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { getCompanyId, getUserId } from '../../../../utils/util';

import Swal from 'sweetalert2';
import { Brands } from '../../brands/brands.interface';
import { Categorys } from '../../categorys/categorys.interface';
import { Subcategorys } from '../../subcategorys/subcategorys.interface';
import { Suppliers } from '../../supplier/supplier.interface';
import { Clients } from '../../client/client.interface';
import { BalanceService } from '../../../../data/balance.service';
import { Users } from '../../user/users.interface';
import { FinanceData } from '../../finance/finance.interface';
import { AuthService } from '../../../../shared/auth.service';
import { UtilsService } from '../../../../shared/utils.service';
import { Box } from '../../box/box.interface';
import { LoadService } from '../../../../shared/load.service';

declare var $: any;

interface PaymentForms {
  id: number;
  label: 'DINHEIRO' | 'CARTÃO DE DÉBITO' | 'CARTÃO DE CRÉDITO' | 'PIX';
  date: string;
  value: number;
  status: 'PA' | 'PE';
  portion_number: number;
  portion_total: number;
}

@Component({
  selector: 'app-pdv',
  templateUrl: './pdv.component.html',
  styleUrl: './pdv.component.scss'
})
export class PdvComponent {
  valueBox = new FormControl('R$ 0,00');

  isEdit = false;
  currentSale!: Sales;
  currentProduct!: Products;
  search = new FormControl('');

  description = new FormControl('');
  price_sale = new FormControl('');
  price_cost = new FormControl('');
  ncm = new FormControl('');
  control_stock = new FormControl('S');
  stock = new FormControl('');
  id_company = new FormControl('');
  id_brand = new FormControl('');
  id_category = new FormControl('');
  id_subcategory = new FormControl('');
  id_supplier = new FormControl('');

  id_client = new FormControl(0, [Validators.required]);
  id_seller = new FormControl(0, [Validators.required]);
  client_id: Options = {
    label: 'Consumidor Final',
    value: 0
  };

  clientsSelect: Options[] = [];
  sellerSelect: Options[] = [];
  brandsSelect: Options[] = [];
  categorySelect: Options[] = [];
  subcategorySelect: Options[] = [];
  supplierSelect: Options[] = [];
  controlStock = [
    { label: 'Sim', value: 'S' },
    { label: 'Não', value: 'N' }
  ];

  quantity = new FormControl(1);
  desconto = new FormControl('R$ 0,00');
  desconto_percentual = new FormControl(0);
  total_value = new FormControl('0');
  value = new FormControl('0');
  value_sale = new FormControl('0');
  paymentValue = new FormControl();

  products: Products[] = [];

  total = 0;
  totalPayment = 0;
  troco = 0;

  paymentSelected!: | 1 | 2 | 3 | 4;
  paymentForms: PaymentForms[] = [];

  portions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

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

  paymentType = new FormControl('1')
  paymentStatus = new FormControl('PA')
  paymentDate = new FormControl(moment().format('YYYY-MM-DD'))

  portionNumber = 1;

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

  paymentOptions: Options[] = [
    {
      label: 'Pago',
      value: 'PA'
    },
    {
      label: 'Pendente',
      value: 'PE'
    },
  ]

  currentBox!: Box;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private salesService: SalesService,
    private routeParam: ActivatedRoute,
    private balanceService: BalanceService,
    public authService: AuthService,
    public utilsService: UtilsService,
    private loaderService: LoadService
  ) {
    this.routeParam.paramMap.subscribe(async (params) => {
      const id = params.get('id');
      this.isEdit = !!id;
      this.load(Number(id));
    });
  }

  ngOnInit(): void {
    this.load();
    this.loadClients();
    this.apiService.findBox({
      filter: {
        id_company: getCompanyId(),
        id_user: getUserId(),
        status: 'AB'
      }
    }).then(res => {
      this.currentBox = res.results[0] as Box;

      if (this.utilsService.isDateLessThanCurrent(this.currentBox.date_hour as string)) {
        const element = document.getElementById('modalCloseBox');
        if (element) {
          var myModal = new bootstrap.Modal(element, {
            backdrop: 'static'
          });
          myModal.show();
        }
      }
    }).catch(() => {
      const element = document.getElementById('modalOpenBox');
      if (element) {
        var myModal = new bootstrap.Modal(element, {
          backdrop: 'static'
        });
        myModal.show();
      }
    })
  }

  loadProducts() {
    this.apiService.findProducts({
      filter: {
        deleted: "N",
        id_company: getCompanyId()
      },
      search: this.search.value || '',
      limit: 5
    }).then(response => {
      if (!this.search.value) {
        this.products = [];
      } else {
        this.products = response.results;
      }
    }).catch((error) => {
      this.products = [];
    });
  }

  openModal = () => {
    $('#modalListProduct').modal('show');
  }

  openModalAddProduct = () => {
    $('#modalAddProduct').modal('show');
  }

  openModalPayment = () => {
    if (Number(this.client_id.value) >= 0) {
      if (this.id_seller.valid && this.id_seller.value && this.id_seller.value > 0) {
        if (this.products.length > 0 || ((this.currentSale && this.currentSale.products) ?? []).length > 0) {
          $('#modalPayment').modal('show');
          this.paymentValue.setValue(this.formatValueCurrency(this.total - this.totalPayment));
        } else {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Adicione produtos para continuar!",
            showConfirmButton: false,
            timer: 1500
          });
        }
      } else {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Selecione um vendedor para continuar!",
          showConfirmButton: false,
          timer: 1500
        });
      }
    } else {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Selecione um cliente para continuar!",
        showConfirmButton: false,
        timer: 1500
      });
    }
  }

  openModalClient = () => {
    $('#modalClient').modal('show');
  }

  closeModal = () => {
    $('#modalListProduct').modal('hide');
    $('#modalAddProduct').modal('hide');
    $('#modalPayment').modal('hide');
    $('#modalValorVenda').modal('hide');
    $('#modalClient').modal('hide');
  }

  async load(id?: number) {
    this.apiService.findBrands({
      filter: {
        id_company: getCompanyId()
      }
    }).then(response => {
      this.brandsSelect = response.results.map((item: Brands) => ({ label: item.description, value: item.id }));
    });

    this.apiService.findCategorys({
      filter: {
        id_company: getCompanyId()
      }
    }).then(response => {
      this.categorySelect = response.results.map((item: Categorys) => ({ label: item.description, value: item.id }));
    });

    this.apiService.findSubcategorys({
      filter: {
        id_company: getCompanyId()
      }
    }).then(response => {
      this.subcategorySelect = response.results.map((item: Subcategorys) => ({ label: item.description, value: item.id }));
    });

    this.apiService.findSuppliers({
      filter: {
        id_company: getCompanyId()
      }
    }).then(response => {
      this.supplierSelect = response.results.map((item: Suppliers) => ({ label: item.name, value: item.id }));
    });

    this.apiService.getUser({
      filter: {
        company: getCompanyId(),
        profile: 'STORE'
      }
    }).subscribe(response => {
      this.sellerSelect = response.results.map((item: Users) => ({ label: item.name, value: item.id }));

      if (this.currentSale) {
        this.id_seller.setValue(this.currentSale.id_seller ? this.currentSale.id_seller : 0);
        console.log(this.id_seller.value);
      }
    });

    if (id) {
      this.salesService.findSales({
        filter: {
          id: id
        }
      }).then(response => {
        if (response.results) {
          this.currentSale = response.results[0] as Sales;
          this.total = 0;
          if (this.currentSale.id_seller) {
            setTimeout(() => {
              this.id_seller.setValue(this.currentSale.id_seller ? this.currentSale.id_seller : 0);
            }, 1000);
          }

          this.currentSale.products?.forEach(product => {
            this.total += Number(product.total);
          });

          this.updateTotal();
        }
      }).catch((error) => {
        console.log(error);
      });
    }
  }

  loadClients(id?: number) {
    this.apiService.findClient({
      filter: {
        id_company: getCompanyId(),
        deleted: 'N'
      }
    }).then(response => {
      this.clientsSelect = response.results.map((item: Clients) => ({ label: item.name, value: item.id }));
      if (id) {
        this.id_client.setValue(id);
        let option = this.clientsSelect.find((client) => client.value === id);
        this.client_id = option ? option : { label: 'Consumidor Final', value: 0 };
        this.updateClient();
      } else if (this.currentSale) {
        this.id_client.setValue(this.currentSale.id_client ? this.currentSale.id_client : 0);
        let newId = this.currentSale.id_client ? this.currentSale.id_client : 0;
        let option = this.clientsSelect.find((client) => client.value === newId);
        this.client_id = option ? option : { label: 'Consumidor Final', value: 0 };
      }
    });
  }

  save() {
    this.loaderService.show();

    this.apiService.createProduct({
      description: this.description.value ? this.description.value : '',
      id_brand: Number(this.id_brand.value) || 0,
      id_category: Number(this.id_category.value) || 0,
      id_subcategory: Number(this.id_subcategory.value) || 0,
      price_sale: Number(this.price_sale.value) || 0,
      price_cost: Number(this.price_cost.value) || 0,
      ncm: this.ncm.value ? this.ncm.value : '',
      id_fornecedor: Number(this.id_supplier.value) || 0,
      control_stock: this.control_stock.value as 'S' | 'N' || 'S',
      stock: Number(this.stock.value) || 0,
      id_company: 1
    }).then(() => {
      this.loaderService.hide();
      $('#modalProduct').modal('hide');
    });
  }

  saveBox() {
    this.apiService.createBox({
      id_company: getCompanyId(),
      id_user: getUserId(),
      value_init: this.utilsService.currencyToNumber(this.valueBox.value as string)
    }).then((data) => {
      let element = document.getElementById('modalOpenBox');

      if (element) {
        var myModal = bootstrap.Modal.getInstance(element);
        if (myModal) {
          myModal.hide();
        }
      }

      this.load();
    })
  }

  createSale(callback?: () => void) {
    this.loaderService.show();
    this.salesService.createSale({
      id_company: getCompanyId(),
      id_user: getUserId(),
      id_seller: this.id_seller.value ? Number(this.id_seller.value) : null,
      total: 0
    }).then(response => {
      this.loaderService.hide();
      this.currentSale = response.results as Sales;
      if (callback) {
        callback();
      }
    });
  }

  async addProduct(product: Products): Promise<void> {
    const response = await this.salesService.addProduct({
      id: 0,
      id_product: product.id || 0,
      id_sale: this.currentSale.id || 0,
      quantity: Number(this.quantity.value),
      desconto: Number(this.desconto.value?.replace('R$', '').replace('.', '').replace(',', '.') || 0) || 0,
      desconto_percentual: Number(this.desconto_percentual.value) || 0,
      total: Number(this.total_value.value?.replace('R$', '').replace('.', '').replace(',', '.') || 0)
    })

    if (response) {
      this.search.setValue('');
      this.closeModal();
      this.load(this.currentSale.id);
    }
  }

  verifySale(product: Products) {
    if (product.control_stock === 'S' && product?.stock && Number(product?.stock) > 0 && Number(product?.stock) > (Number(product.stock_minimum) ?? 0)) {
      this.closeModal();
      this.quantity.setValue(1);
      this.desconto.setValue('R$ 0,00');
      this.desconto_percentual.setValue(0);
      this.total_value.setValue(this.formatValueCurrency(product.price_sale ? product.price_sale : 0));
      this.value.setValue(this.formatValueCurrency(product.price_cost || 0));
      this.value_sale.setValue(this.formatValueCurrency(product.price_sale || 0));

      this.currentProduct = product;
      this.openModalAddProduct();
    } else {
      if (product?.stock && Number(product?.stock) === 0) {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Produto sem estoque!",
          showConfirmButton: false,
          timer: 1500
        });
      } else {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Produto atingiu o estoque mínimo!",
          showConfirmButton: false,
          timer: 1500
        });
      }
    }
  }

  changeQuantity(quantity: number) {
    let inStock = Number(this.currentProduct.stock) - Number(this.currentProduct.stock_minimum) - quantity;

    if (inStock < 0) {
      this.quantity.setValue(quantity - 1);
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Produto atingiu o Limite de Estoque!",
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }

    let valueFormated = this.formatValue(this.value_sale.value?.replace(/[^0-9]/g, '') || 0);
    this.total_value.setValue(this.formatValueCurrency(Number(valueFormated) * quantity));
  }

  changeDiscount() {
    if (Number(this.desconto_percentual.value) <= 0) {
      this.desconto_percentual.setValue(0);
    }

    let valueDiscount = (Number(this.desconto_percentual.value) * (Number(this.currentProduct.price_sale) * Number(this.quantity.value))) / 100

    this.desconto.setValue(this.formatValueCurrency(valueDiscount))
    this.total_value.setValue(this.formatValueCurrency((Number(this.currentProduct.price_sale) * Number(this.quantity.value)) - valueDiscount))
  }

  changeDiscountValue() {
    let newValue = this.formatValue(this.desconto.value?.replace(/[^0-9]/g, '') || 0);
    if (Number(newValue) <= 0) {
      this.desconto.setValue('0');
    }

    let valueWhitDiscount = (Number(this.currentProduct.price_sale) * Number(this.quantity.value)) - Number(newValue);
    this.total_value.setValue(this.formatValueCurrency(valueWhitDiscount));
    this.desconto_percentual.setValue(Number(((Number(newValue) * 100) / (Number(this.currentProduct.price_sale) * Number(this.quantity.value))).toFixed(2)));
    this.desconto.setValue(this.formatValueCurrency(newValue));
  }

  addProductToSale() {
    if (this.currentSale) {
      this.addProduct(this.currentProduct);
    } else {
      this.createSale(() => this.addProduct(this.currentProduct).then((data) => {
        this.closeModal();
        this.router.navigate(['/app/sales/pdv/' + this.currentSale.id]);
      }));
    }

    this.closeModal();
  }

  async deleteProduct(product: SaleProduct): Promise<void> {
    const response = await this.salesService.deleteProduct(product)

    if (response && this.isEdit) {
      this.load(this.currentSale.id);
    }
  }

  formatValueCurrency(value: string | number) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value));
  }

  formatValue(value: string | number) {
    return (Number(value) / 100).toFixed(2);
  }

  updateTotal() {
    this.salesService.updateSale({
      id: this.currentSale.id,
      total: this.total,
      status: 'AB'
    }).then(data => {
      console.log(data);
    })
  }

  updateClient() {
    this.salesService.updateSale({
      id: this.currentSale.id,
      total: this.total,
      id_client: Number(this.client_id.value) > 0 ? Number(this.client_id.value) : null,
      status: 'AB'
    }).then(data => {
      console.log(data);
    })
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
          date: this.paymentDate.value ?? '',
          status: this.paymentStatus.value as 'PA' | 'PE' ?? 'PA',
          portion_number: 1,
          portion_total: 1
        });
        break;
      case 2:
        this.paymentForms.push({
          id: 2,
          label: 'CARTÃO DE DÉBITO',
          value: value,
          status: this.paymentStatus.value as 'PA' | 'PE' ?? 'PA',
          date: this.paymentDate.value ?? '',
          portion_number: 1,
          portion_total: 1
        });
        break;
      case 3:
        this.paymentForms.push({
          id: 3,
          label: 'CARTÃO DE CRÉDITO',
          value: value,
          date: this.paymentDate.value ?? '',
          status: this.paymentStatus.value as 'PA' | 'PE' ?? 'PA',
          portion_number: 1,
          portion_total: this.portionNumber
        });
        break;
      case 4:
        this.paymentForms.push({
          id: 4,
          label: 'PIX',
          value: value,
          date: this.paymentDate.value ?? '',
          status: this.paymentStatus.value as 'PA' | 'PE' ?? 'PA',
          portion_number: 1,
          portion_total: 1
        });
        break;
    }

    this.totalPayment += value;
    this.paymentValue.setValue(this.formatValueCurrency(this.total - this.totalPayment));
    this.paymentType.setValue('1');
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

  finishedSale() {
    this.loaderService.show();
    this.closeModal();
    let newSaleValue = this.currentSale;
    newSaleValue.status = 'FE';
    newSaleValue.id_user = this.id_seller.value ? Number(this.id_seller.value) : getUserId();
    newSaleValue.id_client = Number(this.client_id.value) > 0 ? Number(this.client_id.value) : null;
    newSaleValue.total = this.total;
    newSaleValue.id_seller = this.id_seller.value ? Number(this.id_seller.value) : null;
    newSaleValue.payforms = this.paymentForms.map(item => {
      return {
        id_sale: this.currentSale.id as number,
        id_form: item.id,
        value: item.value,
        date: item.date,
        portion_number: item.portion_number,
        portion_total: item.portion_total
      }
    });

    this.salesService.updateSale(newSaleValue).then((data) => {
      Swal.fire({
        title: 'Sucesso!',
        text: 'Venda realizada com sucesso.',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        let promises: Promise<void>[] | undefined = [];
        promises = this.currentSale.products?.map((product): Promise<void> => {
          return this.balanceService.newMoviment(product.product as Products, product.quantity, 'S');
        })

        promises?.push(...this.saveFinances());

        Promise.all(promises as any[]).then(() => {
          this.loaderService.hide();
          window.location.href = location.origin + '/app/sales/list';
        });

        this.saveBoxMov();
      });
    });
  }

  saveClient() {
    this.loaderService.show();
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
      name: this.nome.value || '',
      numero: this.numero.value || '',
      razao_social: this.razao_social.value || '',
      rg_inscricao: this.rg_inscricao.value || '',
      telefone: this.telefone.value || '',
      id_company: 1,
    }).then(res => {
      this.apelido.setValue('');
      this.bairro.setValue('');
      this.celular.setValue('');
      this.cep.setValue('');
      this.cidade.setValue('');
      this.complemento.setValue('');
      this.data_nascimento.setValue('');
      this.documento.setValue('');
      this.email.setValue('');
      this.endereco.setValue('');
      this.genero.setValue('');
      this.icms.setValue('');
      this.nome.setValue('');
      this.numero.setValue('');
      this.razao_social.setValue('');
      this.rg_inscricao.setValue('');
      this.telefone.setValue('');
      this.loadClients(res.results.id);
      this.loaderService.hide();
    })

    this.closeModal();
  }

  saveFinances() {
    let promises: Promise<any>[] = [];

    this.paymentForms.forEach((payment, index) => {
      if (payment.id === 3) {
        for (let i = 0; i < payment.portion_total; i++) {
          let finance: FinanceData = {
            client: Number(this.currentSale.id_client),
            company: getCompanyId(),
            date_expiration: moment(payment.date).add(i + 1, 'month').format('YYYY-MM-DD'),
            date_finance: payment.date,
            number_order: '',
            observation: 'Conta gera pela venda de mercadoria - Venda ' + this.currentSale.id + ' Parcela ' + (i + 1) + '/' + payment.portion_total,
            payform: payment.id,
            portion_value: i + 1,
            status: payment.status,
            type: 'R',
            value: payment.value / payment.portion_total,
            wild: 'V'
          }

          promises.push(this.apiService.createFinance(finance));
        }
      } else {
        let finance: FinanceData = {
          client: Number(this.currentSale.id_client),
          company: getCompanyId(),
          date_expiration: payment.date,
          date_finance: payment.date,
          number_order: '',
          observation: 'Conta gera pela venda de mercadoria - Venda ' + this.currentSale.id,
          payform: payment.id,
          portion_value: 1,
          status: payment.status,
          type: 'R',
          value: payment.value,
          wild: 'V'
        }
        promises.push(this.apiService.createFinance(finance));
      }

    });

    return promises;
  }

  saveBoxMov() {
    console.log(this.currentSale);
    this.apiService.createBoxMov({
      id_caixa: this.currentBox.id,
      value: this.total,
      id_sale: this.currentSale.id
    }).then((data) => {
      console.log(data);
    });
  }

  changeValueFormat() {
    let value = this.paymentValue.value;

    if (value) {
      value = value.replace(/[^0-9]/g, '')
      value = value.replace('.', '').replace(',', '.');
      value = Number(value) / 100;
      value = this.formatValueCurrency(value);
      this.paymentValue.setValue(value);
    }
  }

  selectPortion(portion: number) {
    this.portionNumber = portion;
  }

  closeBox() {
    $('#modalCloseBox').modal('hide');
    this.router.navigate(['/app/box/close/' + this.currentBox.id]);
  }
}
