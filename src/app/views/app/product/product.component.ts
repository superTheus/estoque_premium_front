import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Products } from './product.interface';
import { ApiService } from '../../../data/api.service';
import { Options } from '../../../components/select-default/select-default.interface';
import { Brands } from '../brands/brands.interface';
import { Categorys } from '../categorys/categorys.interface';
import { Subcategorys } from '../subcategorys/subcategorys.interface';
import { Suppliers } from '../supplier/supplier.interface';
import { getCompanyId, getPermision } from '../../../utils/util';

import Swal from 'sweetalert2';
import { BalanceService } from '../../../data/balance.service';

declare var $: any;

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit {
  form!: FormGroup;
  formSearch!: FormGroup;

  isEditMode = false;
  productSelected?: Products;
  data: Products[] = [];

  brandsSelect: Options[] = []
  categorySelect: Options[] = []
  subcategorySelect: Options[] = []
  supplierSelect: Options[] = []
  controlStock = [
    { label: 'Sim', value: 'S' },
    { label: 'Não', value: 'N' }
  ]

  permissions = getPermision()
  disableNew = false;

  constructor(
    private apiService: ApiService,
    private balanceService: BalanceService,
    private formBuilder: FormBuilder
  ) {

    this.formSearch = this.formBuilder.group({
      search: ['', [Validators.required]]
    })

    this.form = this.formBuilder.group({
      description: ['', [Validators.required]],
      price_sale: ['', [Validators.required]],
      price_cost: ['', [Validators.required]],
      ncm: [''],
      control_stock: ['S'],
      stock: [''],
      id_brand: [''],
      id_category: [''],
      id_subcategory: [''],
      id_fornecedor: [''],
    })

    this.apiService.findProducts({
      filter: {
        deleted: 'N',
        id_company: getCompanyId()
      }
    }).then(res => {
      if (this.permissions?.limite_produtos) {
        console.log(this.permissions?.limite_produtos);

        this.disableNew = this.permissions?.limite_produtos <= res.results.length ? true : false;
      }
    });
  }

  ngOnInit() {
    this.load();
  }

  async load() {
    const [brands, category, subcategory, supplier] = await Promise.all([
      this.apiService.findBrands({
        filter: {
          deleted: 'N',
          id_company: getCompanyId()
        }
      }),
      this.apiService.findCategorys({
        filter: {
          deleted: 'N',
          id_company: getCompanyId()
        }
      }),
      this.apiService.findSubcategorys({
        filter: {
          deleted: 'N',
          id_company: getCompanyId()
        }
      }),
      this.apiService.findSuppliers({
        filter: {
          deleted: 'N',
          id_company: getCompanyId()
        }
      })
    ]);

    this.brandsSelect = brands.results.map((brand: Brands): Options => { return { label: brand.description, value: brand.id || 0 } })
    this.categorySelect = category.results.map((category: Categorys): Options => { return { label: category.description, value: category.id || 0 } })
    this.subcategorySelect = subcategory.results.map((subcategorys: Subcategorys): Options => { return { label: subcategorys.description, value: subcategorys.id || 0 } })
    this.supplierSelect = supplier.results.map((supplier: Suppliers): Options => { return { label: supplier.name || '', value: supplier.id || 0 } })
  }

  loadProducts() {
    if (this.formSearch.get('search')?.value) {
      this.apiService.findProducts({
        filter: {
          deleted: 'N',
          id_company: getCompanyId()
        },
        search: this.formSearch.get('search')?.value
      }).then(res => {
        if (this.formSearch.get('search')?.value) {
          this.data = res.results;
        } else {
          this.data = [];
        }
      })
    }
  }

  openModal() {
    $('#modalProduct').modal('show');
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    let values = this.form.value;

    if (values.price_sale) {
      values.price_sale = values.price_sale.replace('R$', '').replace('.', '').replace(',', '.').trim() || 0;
    }

    if (values.price_cost) {
      values.price_cost = values.price_cost.replace('R$', '').replace('.', '').replace(',', '.').trim() || 0;
    }

    values.id_brand = values.id_brand || null;
    values.id_category = values.id_category || null;
    values.id_subcategory = values.id_subcategory || null;
    values.id_fornecedor = values.id_fornecedor || null;

    if (this.isEditMode) {
      this.apiService.updateProduct({
        id: this.productSelected?.id,
        ...values,
        id_company: getCompanyId(),
        deleted: this.productSelected?.deleted
      }).then(res => {
        this.loadProducts()

        setTimeout(() => {
          $('#modalProduct').modal('hide');
          Swal.fire("Produto salvo", "", "success");
        }, 500);
      })
    } else {
      this.apiService.createProduct({
        ...values,
        id_company: getCompanyId(),
      }).then(res => {
        this.loadProducts()
        this.balanceService.firstMoviment(res.results, Number(this.form.get('stock')?.value) || 0);

        setTimeout(() => {
          $('#modalProduct').modal('hide');
          Swal.fire("Produto editado", "", "success");
        }, 500);
      })
    }
  }

  update(product: Products) {
    this.productSelected = product;
    this.form.get('description')?.setValue(product.description ? product.description : '');
    this.form.get('id_brand')?.setValue(product.id_brand ? String(product.id_brand) : '');
    this.form.get('id_category')?.setValue(product.id_category ? String(product.id_category) : '');
    this.form.get('id_subcategory')?.setValue(product.id_subcategory ? String(product.id_subcategory) : '');
    this.form.get('price_sale')?.setValue(product.price_sale ? this.formatValueCurrency(product.price_sale) : '');
    this.form.get('price_cost')?.setValue(product.price_cost ? this.formatValueCurrency(product.price_cost) : '');
    this.form.get('ncm')?.setValue(product.ncm ? product.ncm : '');
    this.form.get('id_fornecedor')?.setValue(product.id_fornecedor ? String(product.id_fornecedor) : '');
    this.form.get('control_stock')?.setValue(product.control_stock ? product.control_stock : 'S');
    this.form.get('stock')?.setValue(product.stock ? String(product.stock) : '');
    this.isEditMode = true;
    $('#modalProduct').modal('show');
  }

  delete(product: Products) {
    Swal.fire({
      title: "Realmente deseja deletar este produto?",
      showDenyButton: true,
      confirmButtonText: "Sim Deletar",
      denyButtonText: `Não, cancelar`,
      confirmButtonColor: '#d33',
      denyButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        var newProduct = { ...product };
        newProduct.deleted = 'S';
        this.productSelected = newProduct;

        this.apiService.updateProduct(newProduct).then(res => {
          this.loadProducts();
          Swal.fire("Produto deletado", "", "info");
        })
      }
    });
  }

  formatValueCurrency(value: string | number) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value));
  }

  changeValueFormat(control: AbstractControl) {
    let value: any = control.value;

    if (value) {
      value = value.replace(/[^0-9]/g, '')
      value = value.replace('.', '').replace(',', '.');
      value = Number(value) / 100;
      value = this.formatValueCurrency(value);
      control.setValue(value);
    }
  }
}
