import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as bootstrap from 'bootstrap';

import { Options } from '../../../../components/select-default/select-default.interface';
import { ApiService } from '../../../../data/api.service';
import { Brands } from '../../brands/brands.interface';
import { Categorys } from '../../categorys/categorys.interface';
import { Subcategorys } from '../../subcategorys/subcategorys.interface';
import { Suppliers } from '../../supplier/supplier.interface';
import { Products } from '../../product/product.interface';
import { SalesService } from '../../../../data/sales.service';
import { SaleProduct, Sales } from '../sales.interface';
import { ActivatedRoute, Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-pdv',
  templateUrl: './pdv.component.html',
  styleUrl: './pdv.component.scss'
})
export class PdvComponent {
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

  brandsSelect: Options[] = []
  categorySelect: Options[] = []
  subcategorySelect: Options[] = []
  supplierSelect: Options[] = []
  controlStock = [
    { label: 'Sim', value: 'S' },
    { label: 'Não', value: 'N' }
  ]

  quantity = new FormControl(1);
  desconto = new FormControl('R$ 0,00');
  desconto_percentual = new FormControl(0);
  total_value = new FormControl('0');
  value = new FormControl('0');
  value_sale = new FormControl('0');

  products: Products[] = [];

  total = 0;
  totalPayment = 0;
  troco = 0;

  constructor(
    private apiService: ApiService,
    private salesService: SalesService,
    private router: Router,
    private routeParam: ActivatedRoute,
  ) {
    this.routeParam.paramMap.subscribe(async (params) => {
      const id = params.get('id');
      this.isEdit = !!id;
      this.load(Number(id));
    });
  }

  ngOnInit(): void {
  }

  loadProducts(event: KeyboardEvent) {
    if (event.key.toLocaleUpperCase() === 'ENTER') {
      this.apiService.findProducts({
        filter: {
          deleted: "N"
        },
        search: this.search.value || ''
      }).then(response => {
        this.products = response.results;
        this.openModal();
      });
    };
  }

  openModal = () => {
    const element = document.getElementById('modalListProduct');

    if (element) {
      var myModal = new bootstrap.Modal(element, {});
      myModal.show();
    }
  }

  openModalAddProduct = () => {
    const element = document.getElementById('modalAddProduct');

    if (element) {
      var myModal = new bootstrap.Modal(element, {});
      myModal.show();
    }
  }

  openModalPayment = () => {
    const element = document.getElementById('modalPayment');

    if (element) {
      var myModal = new bootstrap.Modal(element, {});
      myModal.show();
    }
  }

  closeModal = () => {
    let element = document.getElementById('modalListProduct');

    if (element) {
      var myModal = bootstrap.Modal.getInstance(element);
      if (myModal) {
        myModal.hide();
      }
    }

    element = document.getElementById('modalAddProduct');

    if (element) {
      var myModal = bootstrap.Modal.getInstance(element);
      if (myModal) {
        myModal.hide();
      }
    }

    element = document.getElementById('modalPayment');

    if (element) {
      var myModal = bootstrap.Modal.getInstance(element);
      if (myModal) {
        myModal.hide();
      }
    }
  }

  async load(id?: number) {
    if (id) {
      this.salesService.findSales({
        filter: {
          id: id
        }
      }).then(response => {
        if (response.results) {
          this.currentSale = response.results[0] as Sales;

          console.log(this.currentSale);
          this.total = 0;
          this.currentSale.products?.forEach(product => {
            this.total += Number(product.total);
          });
        }
      });
    }
  }

  save() {
    this.apiService.createProduct({
      description: this.description.value ? this.description.value : '',
      id_brand: Number(this.id_brand.value) || 0,
      id_category: Number(this.id_category.value) || 0,
      id_subcategory: Number(this.id_subcategory.value) || 0,
      price_sale: Number(this.price_sale.value) || 0,
      price_cost: Number(this.price_cost.value) || 0,
      ncm: this.ncm.value ? this.ncm.value : '',
      id_fornecedor: Number(this.id_supplier.value) || 0,
      control_stock: this.control_stock.value || 'S',
      stock: Number(this.stock.value) || 0,
      id_company: 1
    });

    $('#modalProduct').modal('hide');
  }

  createSale(callback?: () => void) {
    this.salesService.createSale({
      id_company: 1,
      id_user: 1,
      total: 0
    }).then(response => {
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

    if (response && this.isEdit) {
      this.search.setValue('');
      this.closeModal();
      this.load(this.currentSale.id);
    }
  }

  verifySale(product: Products) {
    this.closeModal();
    this.quantity.setValue(1);
    this.desconto.setValue('R$ 0,00');
    this.desconto_percentual.setValue(0);
    this.total_value.setValue(this.formatValueCurrency(product.price_sale ? product.price_sale : 0));
    this.value.setValue(this.formatValueCurrency(product.price_cost || 0));
    this.value_sale.setValue(this.formatValueCurrency(product.price_sale || 0));

    this.currentProduct = product;
    this.openModalAddProduct();
  }

  changeQuantity(quantity: number) {
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
      this.createSale(() => this.addProduct(this.currentProduct).then(() => {
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
}
