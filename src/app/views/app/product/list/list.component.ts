import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Products } from '../product.interface';
import { Options } from '../../../../components/select-default/select-default.interface';
import { getCompanyId, getPermision } from '../../../../utils/util';
import { ApiService } from '../../../../data/api.service';
import { BalanceService } from '../../../../data/balance.service';
import { AuthService } from '../../../../shared/auth.service';
import { Brands } from '../../brands/brands.interface';
import { Categorys } from '../../categorys/categorys.interface';
import { Subcategorys } from '../../subcategorys/subcategorys.interface';
import { Suppliers } from '../../supplier/supplier.interface';
import Swal from 'sweetalert2';

declare var $: any;

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
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
    private formBuilder: FormBuilder,
    public authService: AuthService,
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
      stock_minimum: [''],
      id_brand: [''],
      id_category: [''],
      id_subcategory: [''],
      id_fornecedor: [''],
    })

    this.loadProductsPermissions();
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

  loadProductsPermissions() {
    this.apiService.findProducts({
      filter: {
        deleted: 'N',
        id_company: getCompanyId()
      }
    }).then(res => {
      if (this.permissions?.limite_produtos) {
        this.disableNew = this.permissions?.limite_produtos <= res.results.length ? true : false;
      }
    });
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
          this.loadProductsPermissions();
          Swal.fire("Produto deletado", "", "info");
        })
      }
    });
  }
}
