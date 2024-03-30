import { Component, OnInit } from '@angular/core';
import * as Chart from 'chart.js';
import { Contas } from '../contas/contas.interface';
import { ApiService } from '../../../data/api.service';
import { ChartData, DatasetChart } from '../../../components/chart/chart.component';
import { Finance } from '../payment/payment.interface';
import { SalesService } from '../../../data/sales.service';
import { Sales } from '../sales/sales.interface';
import { getCompanyId } from '../../../utils/util';


@Component({
  selector: 'app-dashboards',
  templateUrl: './dashboards.component.html',
  styleUrl: './dashboards.component.scss'
})
export class DashboardsComponent implements OnInit {
  currentAccount!: Contas;

  isFinanceView = false;
  isSaleView = true;

  totalReceber: number = 0;
  totalPagar: number = 0;
  qtdReceberVencidas: number = 0;
  qtdPagarVencidas: number = 0;

  chartFinancePrimary!: ChartData;
  chartSalesPrimary!: ChartData;

  salesOpen = 0;
  salesClose = 0;
  salesCancelad = 0;


  labelsYear = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  CHART_COLORS = {
    green: 'rgb(76, 206, 172)',
    red: 'rgb(219, 80, 74)'
  };

  constructor(
    private apiService: ApiService,
    private saleService: SalesService
  ) { }

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.apiService.findContas({
      filter: {
        deleted: "N",
        id_company: getCompanyId()
      }
    }).then(data => {
      this.currentAccount = data.results[0]
    });

    this.apiService.findContasFinanceiro({
      filter: {
        deleted: "N",
        id_company: getCompanyId()
      }
    });

    this.apiService.findContasFinanceiro(
      {
        filter: {
          deleted: 'N',
          id_company: getCompanyId()
        }
      }
    ).then((data) => {
      this.generateChartsLineFinance(data);
      this.generateCardInfos(data.results);
    })

    this.saleService.findSales({
      filter: {
        id_company: getCompanyId()
      }
    }).then(data => {
      this.salesOpen = data.results.filter((sale: Sales) => sale.status === 'AB').length;
      this.salesClose = data.results.filter((sale: Sales) => sale.status === 'FE').length;
      this.salesCancelad = data.results.filter((sale: Sales) => sale.status === 'CA').length;

      this.generateChartsLineSales(data);
    })
  }

  changeView(mode: 'finance' | 'sale') {
    if (mode === 'finance') {
      this.isFinanceView = true;
      this.isSaleView = false;
    }

    if (mode === 'sale') {
      this.isFinanceView = false;
      this.isSaleView = true;
    }

    this.load();
  }

  generateCardInfos(finance: Finance[]) {
    let totalLatePayment = 0;
    let totalLateReceive = 0;

    finance.forEach(finance => {
      var inputDate = new Date(finance.vencimento as string);
      var today = new Date();
      today.setHours(0, 0, 0, 0);

      if (finance.status_pagamento === 'PE') {
        if (finance.tipo_conta === 'P') {
          if (inputDate.getTime() < today.getTime()) {
            totalLatePayment++;
          };

          this.totalPagar += Number(finance.valor);
        }

        if (finance.tipo_conta === 'R') {
          if (inputDate.getTime() < today.getTime()) {
            totalLateReceive++;
          };

          this.totalReceber += Number(finance.valor);
        }
      }
    });

    this.qtdPagarVencidas = totalLatePayment;
    this.qtdReceberVencidas = totalLateReceive;
  }

  generateChartsLineFinance(data: {
    message: string;
    results: any;
  }) {
    let valuesPayment = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    let valuesReceive = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

    data.results.forEach((conta: Finance) => {
      const dateString = conta.vencimento as string;
      const date = new Date(dateString);
      const month = date.getMonth() + 1

      for (let i = 1; i <= 12; i++) {
        if (month === i && conta.tipo_conta === 'P') {
          valuesPayment[i] += (Number(conta.valor) * -1);
        }

        if (month === i && conta.tipo_conta === 'R') {
          valuesReceive[i] += Number(conta.valor);
        }
      }
    });

    let dataset: DatasetChart[] = [
      {
        label: 'Despesas',
        backgroundColor: [this.CHART_COLORS.red],
        borderColor: [this.CHART_COLORS.red],
        borderWidth: 1,
        data: valuesPayment,
        fill: false
      },
      {
        label: 'Receitas',
        data: valuesReceive,
        borderColor: [this.CHART_COLORS.green],
        backgroundColor: [this.CHART_COLORS.green],
        fill: false
      }
    ]

    const config: ChartData = {
      type: 'bar',
      data: dataset,
      labels: this.labelsYear,
      options: {
        responsive: true,
        plugins: {
          filler: {
            propagate: false,
          },
          title: {
            display: true,
            text: 'Fluxo de caixa anual'
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

    this.chartFinancePrimary = config;
  }

  generateChartsLineSales(data: {
    message: string;
    results: any;
  }) {
    let values = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

    data.results.forEach((sale: Sales) => {
      const dateString = sale.date_hour as string;
      const date = new Date(dateString);
      const month = date.getMonth() + 1

      for (let i = 1; i <= 12; i++) {
        if (month === i)
          values[i]++;
      }
    });

    let dataset: DatasetChart[] = [
      {
        label: 'Vendas',
        backgroundColor: [this.CHART_COLORS.green],
        borderColor: [this.CHART_COLORS.green],
        borderWidth: 1,
        data: values,
        fill: false
      },
    ]

    const config: ChartData = {
      type: 'line',
      data: dataset,
      labels: this.labelsYear,
      options: {
        responsive: true,
        plugins: {

          filler: {
            propagate: false,
          },
          title: {
            display: true,
            text: 'Vendas x Período'
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

    this.chartSalesPrimary = config;
  }

}
