import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BalanceService, Inputs, ProductsInputs } from '../../../data/balance.service';
import { getCompanyId, getUserId } from '../../../utils/util';
import { ApiService } from '../../../data/api.service';
import { Products } from '../product/product.interface';
import { Options } from '../../../components/select-default/select-default.interface';
import { ReportsService } from '../../../shared/reports.service';
import { AuthService } from '../../../shared/auth.service';

declare const $: any;

interface ProductsInputsSelect extends ProductsInputs {
  description: string;
}

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.scss'
})
export class StockComponent implements OnInit {
  document = new FormControl('');
  id_product = new FormControl('');
  quantity = new FormControl('');

  isEditMode = false;
  data: Inputs[] = [];
  product: Products[] = [];

  productSelected: Options[] = [];

  productsList: ProductsInputsSelect[] = [];

  constructor(
    private balanceService: BalanceService,
    private apiService: ApiService,
    private reportService: ReportsService,
    public authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.load();
  }

  load() {
    Promise.all([
      this.balanceService.findInputs({
        filter: {
          id_company: getCompanyId()
        },
        limit: 10,
        order: {
          field: "id",
          order: "DESC"
        }
      }),
      this.apiService.findProducts({
        filter: {
          id_company: getCompanyId(),
          deleted: 'N'
        }
      })
    ]).then(([inputs, products]) => {
      this.data = inputs.results;
      this.product = products.results;

      this.productSelected = this.product.map(p => {
        return {
          value: Number(p.id),
          label: p.description as string
        }
      });
    });


    this.balanceService.findInputs({
      filter: {
        id_company: getCompanyId()
      }
    }).then(res => {
      this.data = res.results;
    })
  }

  save() {
    this.balanceService.insertInputs({
      documento: this.document.value as string,
      id_company: getCompanyId(),
      id_user: getUserId(),
      products: this.productsList,
    }).then(res => {
      this.load();
    })

    $('#modalProduct').modal('hide');
  }

  addProduct() {
    this.productsList.push({
      id_product: Number(this.id_product.value as string),
      quantity: Number(this.quantity.value as string),
      description: (document.querySelector('.selectedProduct option:checked') as HTMLOptionElement)?.textContent || ''
    });

    this.id_product.setValue('');
    this.quantity.setValue('');
  }

  print(input: Inputs) {
    this.reportService.inputReport(input);
  }

  removeProduct(product: ProductsInputsSelect) {
    const index = this.productsList.findIndex(p => p.id_product === product.id_product);
    this.productsList.splice(index, 1);
  }
}
