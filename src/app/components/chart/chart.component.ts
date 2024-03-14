import { Component, OnInit, ViewChild, ElementRef, Input, AfterViewInit, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import Chart, { ChartTypeRegistry } from 'chart.js/auto';

export interface DatasetChart {
  label: string,
  data: number[],
  backgroundColor: string[],
  borderColor?: string[],
  borderWidth?: number
  fill?: boolean;
}

export interface ChartData {
  labels: string[];
  type: keyof ChartTypeRegistry;
  data: DatasetChart[];
  options: Object;
}

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit, OnDestroy, OnChanges {
  @Input() chartData!: ChartData;

  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  chart!: Chart;


  ngOnInit() {
    this.chart = new Chart(this.canvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true // Aqui você deve usar "y" em vez de "yAxes"
          }
        }
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['chartData'] && !changes['chartData'].firstChange) {
      this.generateChart();
    }
  }

  generateChart() {
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(this.canvas.nativeElement, {
      type: this.chartData.type,
      data: {
        labels: this.chartData.labels,
        datasets: this.chartData.data
      },
      options: this.chartData.options
    });
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
