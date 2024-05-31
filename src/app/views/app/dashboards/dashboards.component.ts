import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Contas } from '../contas/contas.interface';
import { ApiService } from '../../../data/api.service';
import { ChartData, DatasetChart } from '../../../components/chart/chart.component';
import { Finance } from '../payment/payment.interface';
import { SalesService } from '../../../data/sales.service';
import { Sales } from '../sales/sales.interface';
import { getCompanyId } from '../../../utils/util';
import { Company } from '../company/company.interface';
import { AuthService } from '../../../shared/auth.service';
import { UtilsService } from '../../../shared/utils.service';
import { Products } from '../product/product.interface';


@Component({
  selector: 'app-dashboards',
  templateUrl: './dashboards.component.html',
  styleUrl: './dashboards.component.scss'
})
export class DashboardsComponent implements OnInit {
  form!: FormGroup;

  currentAccount!: Contas;

  isFinanceView = false;
  isSaleView = true;

  totalReceber: number = 0;
  totalPagar: number = 0;
  qtdReceberVencidas: number = 0;
  qtdPagarVencidas: number = 0;

  chartFinancePrimary!: ChartData;
  chartSalesPrimary!: ChartData;

  chartSalesSeller!: ChartData;
  chartSalesUser!: ChartData;
  chartSalesPayForms!: ChartData;
  chartSalesDay!: ChartData;
  chartSalesInvestiment!: ChartData;

  salesOpen = 0;
  salesClose = 0;
  salesCancelad = 0;

  company!: Company;

  labelsYear = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  CHART_COLORS = {
    green: 'rgb(76, 206, 172)',
    red: 'rgb(219, 80, 74)',
    yellow: 'rgb(255, 205, 86)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    blueDark: 'rgb(34, 59, 99)',
  };

  constructor(
    private apiService: ApiService,
    private saleService: SalesService,
    public authService: AuthService,
    private formBuilder: FormBuilder,
    private utilsService: UtilsService
  ) {
    const currentDate = new Date();
    currentDate.setDate(1);
    const firstDayOfMonth = currentDate.toISOString().slice(0, 10);

    const today = new Date();
    const currentDay = today.toISOString().slice(0, 10);

    this.form = this.formBuilder.group({
      dt_ini: [firstDayOfMonth],
      dt_end: [currentDay]
    });
  }

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.apiService.findCompany({
      filter: {
        id: getCompanyId()
      }
    }).then(data => {
      this.company = data.results[0];
    })

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

  generateGrapsSales() {
    this.saleService.findSales({
      filter: {
        status: 'FE',
        id_company: getCompanyId(),
        date_init: this.form.value.dt_ini,
        date_end: this.form.value.dt_end
      }
    }).then(data => {
      let values = data.results as Sales[];

      console.log(values);

      this.graphSaleSeller(values);
      this.graphSaleUser(values);
      this.graphSalePaymentForms(values);
      this.graphSaleDay(values);
      this.graphSaleInvestiment();
    })
  }

  graphSaleSeller(values: Sales[]) {
    const labels = values.reduce((unique: string[], sale: Sales) => {
      if (sale.seller && !unique.includes(sale.seller.name as string)) {
        unique.push(sale.seller.name as string);
      }
      return unique;
    }, []);

    const values_data = labels.map((label: string) => {
      return {
        label: label,
        data: values.filter((sale: Sales) => sale.seller?.name === label).length,
      };
    });

    values_data.sort((a, b) => b.data - a.data);

    this.chartSalesSeller = {
      data: [
        {
          label: 'Vendas por vendedor',
          backgroundColor: [this.CHART_COLORS.blueDark],
          borderColor: [this.CHART_COLORS.blueDark],
          borderWidth: 1,
          data: values_data.map((value: any) => value.data),
          fill: false
        }
      ],
      labels: values_data.map((value: any) => value.label),
      type: 'bar',
      options: {
        responsive: true,
        plugins: {

          filler: {
            propagate: false,
          },
          title: {
            display: true,
            text: 'Vendas por vendedor'
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
  }

  graphSaleUser(values: Sales[]) {
    const labels = values.reduce((unique: string[], sale: Sales) => {
      if (sale.user && !unique.includes(sale.user.name as string)) {
        unique.push(sale.user.name as string);
      }
      return unique;
    }, []);

    const values_data = labels.map((label: string) => {
      return {
        label: label,
        data: values.filter((sale: Sales) => sale.user?.name === label).length,
      };
    });

    values_data.sort((a, b) => b.data - a.data);

    this.chartSalesUser = {
      data: [
        {
          label: 'Vendas por Usuário',
          backgroundColor: [this.CHART_COLORS.blueDark],
          borderColor: [this.CHART_COLORS.blueDark],
          borderWidth: 1,
          data: values_data.map((value: any) => value.data),
          fill: false
        }
      ],
      labels: values_data.map((value: any) => value.label),
      type: 'bar',
      options: {
        responsive: true,
        plugins: {

          filler: {
            propagate: false,
          },
          title: {
            display: true,
            text: 'Vendas por Usuário'
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
  }

  graphSalePaymentForms(values: Sales[]) {
    let valuePay = values.map((sale: Sales) => {
      return sale.payforms
    }).flat();

    let data = [
      {
        id: 1,
        label: 'Dinheiro',
        value: valuePay.filter((pay) => {
          return pay?.id_form === 1
        }).reduce((acc, pay) => acc + (Number(pay?.value) ?? 0), 0)
      },
      {
        id: 2,
        label: 'Cartão de Débito',
        value: valuePay.filter((pay) => {
          return pay?.id_form === 2
        }).reduce((acc, pay) => acc + (Number(pay?.value) ?? 0), 0)
      },
      {
        id: 3,
        label: 'Cartão de Crédito',
        value: valuePay.filter((pay) => {
          return pay?.id_form === 3
        }).reduce((acc, pay) => acc + (Number(pay?.value) ?? 0), 0)
      },
      {
        id: 4,
        label: 'Pix',
        value: valuePay.filter((pay) => {
          return pay?.id_form === 4
        }).reduce((acc, pay) => acc + (Number(pay?.value) ?? 0), 0)
      },
      {
        id: 5,
        label: 'Crédiário',
        value: 0
      },
    ]

    data = data.sort((a, b) => b.value - a.value);

    this.chartSalesPayForms = {
      data: [
        {
          label: 'Formas de Pagamento',
          backgroundColor: [this.CHART_COLORS.green],
          borderColor: [this.CHART_COLORS.green],
          borderWidth: 1,
          data: data.map((item) => item.value),
          fill: false
        }
      ],
      labels: data.map((item) => item.label),
      type: 'bar',
      options: {
        indexAxis: 'y',
        elements: {
          bar: {
            borderWidth: 2,
          }
        },
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Ranking Formas de Pagamento'
          }
        }
      },
    }
  }

  graphSaleDay(values: Sales[]) {
    const labels = values.reduce((unique: string[], sale: Sales) => {
      if (sale.user && !unique.includes(this.utilsService.formatDate(sale.date_hour as string))) {
        unique.push(this.utilsService.formatDate(sale.date_hour as string));
      }
      return unique;
    }, []);

    const values_data = labels.map((label: string) => {
      return {
        label: label,
        data: values.filter((sale: Sales) => this.utilsService.formatDate(sale.date_hour as string) === label).length,
      };
    });

    values_data.sort((a, b) => b.data - a.data);

    this.chartSalesDay = {
      data: [
        {
          label: 'Total',
          backgroundColor: [this.CHART_COLORS.blueDark],
          borderColor: [this.CHART_COLORS.blueDark],
          borderWidth: 1,
          data: values_data.map((value: any) => value.data),
          fill: false
        }
      ],
      labels: values_data.map((value: any) => value.label),
      type: 'bar',
      options: {
        responsive: true,
        plugins: {

          filler: {
            propagate: false,
          },
          title: {
            display: true,
            text: 'Vendas por Dia'
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
  }

  graphSaleInvestiment() {
    this.apiService.findProducts({
      filter: {
        id_company: getCompanyId(),
        deleted: 'N'
      }
    }).then((response) => {
      const products: Products[] = response.results;
      let totalCost = products.reduce((acc, product) => acc + (Number((product.price_cost ?? 0) * (product.stock ?? 0)) ?? 0), 0);
      let totalSale = products.reduce((acc, product) => acc + (Number((product.price_sale ?? 0) * (product.stock ?? 0)) ?? 0), 0);

      this.chartSalesInvestiment = {
        data: [
          {
            label: 'Total',
            backgroundColor: [this.CHART_COLORS.red, this.CHART_COLORS.green],
            borderColor: [this.CHART_COLORS.red, this.CHART_COLORS.green],
            borderWidth: 1,
            data: [totalCost, totalSale],
            fill: false
          }
        ],
        labels: ['Investimento', 'Retorno'],
        type: 'pie',
        options: {
          responsive: true,
          plugins: {

            filler: {
              propagate: false,
            },
            title: {
              display: true,
              text: 'Investimento x Retorno'
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
    });
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
