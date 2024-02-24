import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-app',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  items: MenuItem[] = [];

  ngOnInit(): void {
    this.items = [
      {
        label: 'Dashboards',
        icon: 'fas fa-chart-pie mx-2',
        items: [{
          label: 'Vendas',
          icon: '',
          routerLink: '/app/routine',
          styleClass: 'menu-item'
        }]
      },
      {
        label: 'Caixa',
        icon: 'fas fa-box mx-2',
        items: [{
          label: 'Todos os Caixas',
          icon: 'pi pi-fw pi-pencil',
          routerLink: '/app/box'
        }]
      },
      {
        label: 'Vendas',
        icon: 'fas fa-shopping-cart mx-2',
        items: [{
          label: 'Nova Venda',
          icon: 'pi pi-fw pi-pencil',
          routerLink: '/app/sales'
        }]
      },
      {
        label: 'Produtos',
        icon: 'fas fa-boxes mx-2',
        items: [
          {
            label: 'Todos Produtos',
            icon: 'pi pi-fw pi-align-left',
            routerLink: '/app/product'
          },
          {
            label: 'Estoque',
            icon: 'pi pi-fw pi-align-left',
            routerLink: '/app/stock'
          }
        ]
      },
      {
        label: 'Financeiro',
        icon: 'fas fa-piggy-bank mx-2',
        items: [
          {
            label: 'Contas Pagar',
            icon: 'pi pi-fw pi-align-left',
            routerLink: '/app/finance'
          },
          {
            label: 'Contas Receber',
            icon: 'pi pi-fw pi-align-left'
          }
        ]
      },
      {
        label: 'Usuários',
        icon: 'fas fa-user mx-2',
        items: [
          {
            label: 'Minha Conta',
            icon: 'pi pi-fw pi-align-left',
            routerLink: '/app/user'
          },
          {
            label: 'Empresa',
            icon: 'pi pi-fw pi-align-left'
          },
          {
            label: 'Adicionar Usuário',
            icon: 'pi pi-fw pi-align-left'
          }
        ]
      },
    ];
  }
}
