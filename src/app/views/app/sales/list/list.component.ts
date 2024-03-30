import { Component, OnInit } from '@angular/core';
import { SalesService } from '../../../../data/sales.service';
import { Sales } from '../sales.interface';
import { FormControl } from '@angular/forms';
import { getCompanyId } from '../../../../utils/util';

import { jsPDF } from 'jspdf';
import { ReportsService } from '../../../../shared/reports.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {
  data: Sales[] = [];

  filter = new FormControl('AB');

  constructor(
    private salesService: SalesService,
    private reportsService: ReportsService
  ) {

  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.salesService.findSales({
      filter: {
        status: this.filter.value as 'AB' | 'CA' | 'FE' || 'AB',
        id_company: getCompanyId()
      }
    }).then((response) => {
      this.data = response.results;
    });
  }

  delete(id: number) {

  }

  formatDateTime(dateTimeString: string) {
    var dateTimeParts = dateTimeString.split(' ');
    var dateParts = dateTimeParts[0].split('-');
    return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]} ${dateTimeParts[1]}`;
  }

  generatePDF(sale: Sales) {
    this.reportsService.salesReport(sale);
  }
}
