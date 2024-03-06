import { Component, OnInit } from '@angular/core';
import { SalesService } from '../../../../data/sales.service';
import { Sales } from '../sales.interface';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {
  data: Sales[] = [];

  constructor(
    private salesService: SalesService
  ) {

  }

  ngOnInit() {
    this.salesService.findSales({
      filter: {
        status: 'AB'
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
}
