import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { Chart, ChartType } from 'chart.js';
import { GestionApiService } from 'src/app/services/gestion-api.service';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
})
export class LineChartComponent  implements OnInit {


  @Input() backgroundColorCat: string[]=[];
  @Input() borderColorCat: string[]=[];

  @Input() categorias: string[]=[];

  @Input() tipoChartSelected: string = "";

  private datosCategorias: number[]=[];

  public chart!: Chart;
  constructor(private el: ElementRef, private renderer: Renderer2, private gestionServiceApi: GestionApiService) { }

  ngOnInit(): void {
    console.log("Ejecuta line-chart");
    this.inicializarChart();

    this.gestionServiceApi.datos$.subscribe((datos) => {
      if (datos != undefined) {

        this.categorias.push(datos.categoria);
        this.datosCategorias.push(datos.totalResults);

        this.chart.update();
      }
    });
  }

  private inicializarChart() {
    const data = {
      labels: this.categorias,
      datasets: [{
        label: 'Line-chart Dataset',
        data: this.datosCategorias,
        fill: false,
        backgroundColor: this.backgroundColorCat,
        borderColor: this.borderColorCat,
        tension: 0.1
      }]
    };

    const canvas = this.renderer.createElement('canvas');
    this.renderer.setAttribute(canvas, 'id', 'lineChart');
  
    const container = this.el.nativeElement.querySelector('#contenedor-linechart');
    this.renderer.appendChild(container, canvas);
  
    
    this.chart = new Chart(canvas, {
      type: 'line' as ChartType, 
      data: data, 
      options: { 
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            labels: {
              boxWidth: 0,
              font: {
                size: 16,
                weight: 'bold'
              }
            },
          }
        },
      }
    });
    
    this.chart.canvas.width = 100;
    this.chart.canvas.height = 100;
    
    
    
  }

}
