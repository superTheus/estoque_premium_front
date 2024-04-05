import { Injectable } from '@angular/core';
import { Sales } from '../views/app/sales/sales.interface';

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { roboto } from './data.font';
import { Inputs, Moviment } from '../data/balance.service';
import { Products } from '../views/app/product/product.interface';


@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor() { }

  productReport({ product, moviments }: { product: Products, moviments: Moviment[] }) {
    let doc = new jsPDF();

    doc.addFileToVFS("Roboto-Regular.ttf", roboto);
    doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
    doc.setFont("Roboto");

    doc.setFontSize(16);

    (doc as any).autoTable({
      body: [
        ['Produto', product.description],
        ['Preco Custo', this.formatCurrency(product.price_cost ?? 0)],
        ['Preco Venda', this.formatCurrency(product.price_sale ?? 0)],
        ['NCM', product.ncm],
        ['Estoque', product.stock],
        ['Custo de Estoque', this.formatCurrency((product.price_cost ?? 0) * (product.stock ?? 0))],
        ['Venda de Estoque', this.formatCurrency((product.price_sale ?? 0) * (product.stock ?? 0))],
        ['Lucro previsto', this.formatCurrency(((product.price_sale ?? 0) * (product.stock ?? 0)) - ((product.price_cost ?? 0) * (product.stock ?? 0)))],
      ]
    });

    (doc as any).autoTable({
      head: [['Tipo movimentacao', 'Saldo anterior', 'Novo Saldo', 'Data hora']],
      body: moviments.map(p => [p.type === 'C' ? 'Saldo Inicial' : p.type === 'I' ? 'Entrada' : 'Venda', p.balance_preview, p.balance_new, this.formatDate(p.date_hour)]),
      styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0, 0, 0] },
      headStyles: { fillColor: [41, 40, 40], textColor: [255, 255, 255] },
    });

    const pdfOutput = doc.output();
    const blob = new Blob([pdfOutput], { type: 'application/pdf' });
    const blobURL = URL.createObjectURL(blob);
    window.open(blobURL);
  }

  salesReport(sale: Sales) {
    let doc = new jsPDF();

    doc.addFileToVFS("Roboto-Regular.ttf", roboto);
    doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
    doc.setFont("Roboto");

    let id = sale.id?.toString().padStart(6, '0');
    let title = "Venda nº " + id;

    doc.setFontSize(16);
    doc.text(title, 80, 10);

    (doc as any).autoTable({
      body: [
        ['Data', this.formatDate(sale.date_hour ?? '')],
        ['Cliente', sale.id_client ? sale.client?.name : 'Consumidor Final'],
        ['Vendedor', sale.user?.name],
        ['Valor Total', 'R$ ' + this.formatCurrency(sale.total ?? 0)],
      ],
    });

    (doc as any).autoTable({
      head: [['Produto', 'Quantidade', 'Valor', 'Total']],
      body: sale.products ? sale.products.map(p => [p.product?.description, p.quantity, 'R$ ' + this.formatCurrency(p.product?.price_sale ?? 0), 'R$ ' + this.formatCurrency(p.quantity * (p.product?.price_sale ? p.product?.price_sale : 0) ?? 0)]) : [],
      styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0, 0, 0] },
      headStyles: { fillColor: [41, 40, 40], textColor: [255, 255, 255] },
    });

    const pdfOutput = doc.output();
    const blob = new Blob([pdfOutput], { type: 'application/pdf' });
    const blobURL = URL.createObjectURL(blob);
    window.open(blobURL);
  }

  salesAllReport(sales: Sales[]) {
    let doc = new jsPDF();

    doc.addFileToVFS("Roboto-Regular.ttf", roboto);
    doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
    doc.setFont("Roboto");

    doc.setFontSize(16);
    sales.forEach((sale, index) => {

      let id = sale.id?.toString().padStart(6, '0');
      let title = "Venda nº " + id;

      doc.text(title, 80, (index + 1) * 10);

      (doc as any).autoTable({
        body: [
          ['Venda', sale.id?.toString().padStart(6, '0')],
          ['Data', this.formatDate(sale.date_hour ?? '')],
          ['Cliente', sale.id_client ? sale.client?.name : 'Consumidor Final'],
          ['Vendedor', sale.user?.name],
          ['Valor Total', 'R$ ' + this.formatCurrency(sale.total ?? 0)],
        ],
      });

      (doc as any).autoTable({
        head: [['Produto', 'Quantidade', 'Valor', 'Total']],
        body: sale.products ? sale.products.map(p => [p.product?.description, p.quantity, 'R$ ' + this.formatCurrency(p.product?.price_sale ?? 0), 'R$ ' + this.formatCurrency(p.quantity * (p.product?.price_sale ? p.product?.price_sale : 0) ?? 0)]) : [],
        styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0, 0, 0] },
        headStyles: { fillColor: [41, 40, 40], textColor: [255, 255, 255] },
      });
    });

    const pdfOutput = doc.output();
    const blob = new Blob([pdfOutput], { type: 'application/pdf' });
    const blobURL = URL.createObjectURL(blob);
    window.open(blobURL);
  }

  inputReport(input: Inputs) {
    let doc = new jsPDF();

    doc.addFileToVFS("Roboto-Regular.ttf", roboto);
    doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
    doc.setFont("Roboto");

    let id = input.id?.toString().padStart(6, '0');
    let title = "Entrada nº " + id;

    doc.setFontSize(16);
    doc.text(title, 80, 10);

    (doc as any).autoTable({
      body: [
        ['Data', this.formatDate(input.date_hour ?? '')],
        ['Documento', input.documento],
        ['Usuario', input.user?.name],
      ],
    });

    (doc as any).autoTable({
      head: [['Produto', 'Quantidade', 'Saldo Atual', 'Saldo Anterior']],
      body: input.products.map(p => [p.product?.description, p.quantity, p.product?.stock, (p.product?.stock ?? 0) - p.quantity]),
      styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0, 0, 0] },
      headStyles: { fillColor: [41, 40, 40], textColor: [255, 255, 255] },
    });

    const pdfOutput = doc.output();
    const blob = new Blob([pdfOutput], { type: 'application/pdf' });
    const blobURL = URL.createObjectURL(blob);
    window.open(blobURL);
  }

  private formatDate(dateString: string) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Os meses no JavaScript começam do 0
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }

  private formatCurrency(value: number) {
    let formatted = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', currencyDisplay: 'narrowSymbol' }).format(value);
    return formatted.replace(/\s?R\$/g, '').trim();
  }
}
