import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../data/api.service';
import { Box } from '../box.interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UtilsService } from '../../../../shared/utils.service';
import Swal from 'sweetalert2';
import { LoadService } from '../../../../shared/load.service';

@Component({
  selector: 'app-close',
  templateUrl: './close.component.html',
  styleUrl: './close.component.scss'
})
export class CloseComponent {
  box!: Box;
  form!: FormGroup;
  disabled = false;

  constructor(
    private route: ActivatedRoute,
    private routerControl: Router,
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    public utilsService: UtilsService,
    private loaderService: LoadService
  ) {
    let id = Number(this.route.snapshot.paramMap.get('id'));

    this.form = this.formBuilder.group({
      value_debit: ['R$ 0,00'],
      value_credit: ['R$ 0,00'],
      value_money: ['R$ 0,00'],
      value_others: ['R$ 0,00'],
      observacoes: [''],
      status: ['FE'],
      id: [id]
    });

    this.apiService.findBox({
      filter: {
        id: id
      }
    }).then((response) => {
      this.box = response.results[0];

      this.form.get('value_debit')?.setValue(this.utilsService.numberToCurrency(Number(this.box.value_debit)));
      this.form.get('value_credit')?.setValue(this.utilsService.numberToCurrency(Number(this.box.value_credit)));
      this.form.get('value_money')?.setValue(this.utilsService.numberToCurrency(Number(this.box.value_money)));
      this.form.get('value_others')?.setValue(this.utilsService.numberToCurrency(Number(this.box.value_others)));
      this.form.get('observacoes')?.setValue(this.box.observacoes);

      this.disabled = this.box.status === 'FE';
    });
  }

  save() {
    this.loaderService.show();
    let newBox: Box = {
      ...this.box,
      value_credit: this.utilsService.currencyToNumber(this.form.value.value_credit),
      value_debit: this.utilsService.currencyToNumber(this.form.value.value_debit),
      value_money: this.utilsService.currencyToNumber(this.form.value.value_money),
      value_others: this.utilsService.currencyToNumber(this.form.value.value_others),
      observacoes: this.form.value.observacoes,
      status: this.form.value.status
    };

    this.apiService.updateBox(newBox).then((response) => {
      this.loaderService.hide();
      Swal.fire('Sucesso', 'Caixa fechado com sucesso', 'success').then(() => {
        this.routerControl.navigate(['/app/box/list']);
      });
    });
  }
}
