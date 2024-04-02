import { Component, OnInit } from '@angular/core';
import { Sales } from '../../sales/sales.interface';
import { SalesService } from '../../../../data/sales.service';
import { ApiService } from '../../../../data/api.service';
import { formatCurrency, getCompanyId } from '../../../../utils/util';
import { Clients } from '../../client/client.interface';
import { Options } from '../../../../components/select-default/select-default.interface';
import { FormControl } from '@angular/forms';
import { ReportsService } from '../../../../shared/reports.service';
import { ChartData, DatasetChart } from '../../../../components/chart/chart.component';

@Component({
  selector: 'app-sales-routine',
  templateUrl: './salesRoutine.component.html',
  styleUrl: './salesRoutine.component.scss'
})
export class SalesRoutineComponent implements OnInit {
  sales: Sales[] = [];
  clients: Clients[] = [];
  clientsSelected: Options[] = [{ value: 0, label: 'Todos' }];

  client = new FormControl('0');
  dateInit = new FormControl('');
  dateEnd = new FormControl('');

  total = 0;

  view: 'table' | 'chart' = 'table';

  CHART_COLORS = {
    green: 'rgb(76, 206, 172)',
    red: 'rgb(219, 80, 74)'
  };

  chartPieClient!: ChartData;
  chartPieClientTotal!: ChartData;

  constructor(
    private salesService: SalesService,
    private apiService: ApiService,
    private reportsService: ReportsService
  ) { }

  ngOnInit(): void {
    this.setDateRange();
    this.load();
    this.loadClients();
  }

  load() {
    let filters: any = {
      id_company: getCompanyId()
    }

    if (this.client.value !== '0') {
      filters['id_client'] = this.client.value;
    }

    if (this.dateInit.value && this.dateEnd.value) {
      filters['date_init'] = this.dateInit.value;
      filters['date_end'] = this.dateEnd.value;
    }

    this.salesService.findSales({
      filter: filters
    }).then((sales) => {
      this.sales = sales.results;
      this.total = sales.results.reduce((acc: number, sale: Sales) => acc + (Number(sale.total) ?? 0), 0);

      this.generateCharts();
    }).catch((error) => {
      this.sales = [];
      this.total = 0;
      this.generateCharts();
    });
  }

  loadClients() {
    this.apiService.findClient({
      filter: {
        id_company: getCompanyId()
      }
    }).then((clients) => {
      this.clients = clients.results;

      this.clientsSelected.push(...this.clients.map(client => {
        return {
          value: client.id as number,
          label: client.name as string
        }
      }));
    });

  }

  setDateRange() {
    let today = new Date();
    let firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    let formatDate = (date: Date) => {
      let year = date.getFullYear();
      let month = ('0' + (date.getMonth() + 1)).slice(-2);
      let day = ('0' + date.getDate()).slice(-2);
      return `${year}-${month}-${day}`;
    };

    this.dateInit.setValue(formatDate(firstDayOfMonth));
    this.dateEnd.setValue(formatDate(today));
  }

  changeView(view: 'table' | 'chart') {
    this.view = view;
    setTimeout(() => {
      this.generateCharts();
    }, 500)
  }

  generatePDF(sale: Sales) {
    this.reportsService.salesReport(sale);
  }

  generateCharts() {
    this.generateChartsPieClients();
    this.generateChartsPieClientsTotal();
  }

  generateChartsPieClients() {
    let dataset: DatasetChart[] = [];

    let labels: {
      labels: string,
      id: any,
      color: string
    }[] = [];

    if (this.client.value === '0') {
      labels = this.clients.map(client => ({
        labels: client.name as string,
        id: client.id,
        color: this.generateRandomColor()
      }));
      labels.unshift({
        labels: 'Consumidor Final',
        id: null,
        color: this.generateRandomColor()
      });
    }

    if (this.client.value !== '0') {
      labels = this.clients.filter(client => client?.id === Number(this.client.value)).map(client => ({
        labels: client.name as string,
        id: client.id,
        color: this.generateRandomColor()
      }));
    }

    dataset = [
      {
        label: 'Valor total em Vendas',
        backgroundColor: labels.map((label) => label.color),
        borderColor: labels.map((label) => label.color),
        borderWidth: 1,
        data: labels.map((label) => {
          return this.sales.filter(value => value.id_client === label.id).reduce((acc: number, value: Sales) => acc + (Number(value.total) ?? 0), 0);
        }),
        fill: false
      }
    ]


    const config: ChartData = {
      type: 'pie',
      data: dataset,
      labels: labels.map((label) => label.labels),
      options: {
        responsive: true,
        plugins: {
          filler: {
            propagate: false,
          },
          title: {
            display: true,
            text: 'Total x Cliente'
          }
        },
        interaction: {
          intersect: false,
        },
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true
          }
        }
      },
    }

    this.chartPieClient = config;
  }

  generateChartsPieClientsTotal() {
    let dataset: DatasetChart[] = [];

    let labels: {
      labels: string,
      id: any,
      color: string
    }[] = [];

    if (this.client.value === '0') {
      labels = this.clients.map(client => ({
        labels: client.name as string,
        id: client.id,
        color: this.generateRandomColor()
      }));
      labels.unshift({
        labels: 'Consumidor Final',
        id: null,
        color: this.generateRandomColor()
      });
    }

    if (this.client.value !== '0') {
      labels = this.clients.filter(client => client?.id === Number(this.client.value)).map(client => ({
        labels: client.name as string,
        id: client.id,
        color: this.generateRandomColor()
      }));
    }

    dataset = [
      {
        label: 'Quantidade de Vendas',
        backgroundColor: labels.map((label) => label.color),
        borderColor: labels.map((label) => label.color),
        borderWidth: 1,
        data: labels.map((label) => {
          return this.sales.filter(value => value.id_client === label.id).reduce((acc: number, value: Sales) => acc + 1, 0);
        }),
        fill: false
      }
    ]

    console.log(dataset);

    const config: ChartData = {
      type: 'pie',
      data: dataset,
      labels: labels.map((label) => label.labels),
      options: {
        responsive: true,
        plugins: {
          filler: {
            propagate: false,
          },
          title: {
            display: true,
            text: 'Quantidade Vendas x Cliente'
          }
        },
        interaction: {
          intersect: false,
        },
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true
          }
        }
      },
    }

    this.chartPieClientTotal = config;
  }

  private generateRandomColor() {
    var r = Math.floor(Math.random() * 256);          // Random between 0-255
    var g = Math.floor(Math.random() * 256);          // Random between 0-255
    var b = Math.floor(Math.random() * 256);          // Random between 0-255
    return 'rgb(' + r + ',' + g + ',' + b + ')';      // Collect all to a string
  }
}
