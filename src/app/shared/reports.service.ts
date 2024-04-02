import { Injectable } from '@angular/core';
import { Sales } from '../views/app/sales/sales.interface';

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { roboto } from './data.font';


@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor() { }

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
    sales.forEach(sale => {
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
