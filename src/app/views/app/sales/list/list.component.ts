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

  filter = new FormControl('');

  constructor(
    private salesService: SalesService,
    private reportsService: ReportsService
  ) {

  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {

    let filter: {
      status?: 'AB' | 'CA' | 'FE' | 'AB'
      id_company: number
    } = {
      id_company: getCompanyId()
    }

    if (this.filter.value) {
      filter.status = this.filter.value as 'AB' | 'CA' | 'FE' || 'AB';
    }

    this.salesService.findSales({
      filter: filter
    }).then((response) => {
      this.data = response.results;
    }).catch((error) => {
      this.data = [];
    });
  }

  delete(sale: Sales) {
    this.salesService.updateSale({
      id: sale.id,
      total: sale.total,
      id_client: Number(sale.id_client) > 0 ? Number(sale.id_client) : null,
      status: 'CA'
    }).then(data => {
      this.loadData();
    })
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
