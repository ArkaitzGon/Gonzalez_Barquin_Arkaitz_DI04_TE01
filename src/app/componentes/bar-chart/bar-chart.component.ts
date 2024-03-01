import { Component, OnInit, Renderer2, ElementRef, Input } from '@angular/core';
import { GestionApiService } from 'src/app/services/gestion-api.service';
import { Chart, ChartType } from 'chart.js/auto';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent  implements OnInit {

  //Recibimos variables desde Home
  @Input() backgroundColorCat: string[]=[];
  @Input() borderColorCat: string[]=[];

  @Input() categorias: string[]=[];

  @Input() tipoChartSelected: string = "";

  private datosCategorias: number[]=[];

  public chart!: Chart;

  public apiData: { categoria: string; totalResults: number }[] = [];

  constructor(private el: ElementRef, private renderer: Renderer2, private gestionServiceApi: GestionApiService) { 
    
  }

  ngOnInit(): void {
    this.inicializarChart();

    this.gestionServiceApi.datos$.subscribe((datos) => {
      if (datos != undefined) {
        //this.categorias.push(datos.categoria);
        //this.datosCategorias.push(datos.totalResults);
        this.apiData.push({ categoria: datos.categoria, totalResults: datos.totalResults });
        
        //this.chart.update();
        this.actualizarChart();
      } 
    });
  }

  private inicializarChart() {

    let data = null;
  
    if (this.tipoChartSelected === "bar-chart"){
      data = {
        //labels:this.categorias,
        labels: this.apiData.map(item => item.categoria),
        datasets: [{
          label: 'Bar-chart Dataset',
          //data:this.datosCategorias,
          data: this.apiData.map(item => item.totalResults),
          fill: false,
          backgroundColor: this.backgroundColorCat,
          borderColor: this.borderColorCat,
          tension: 0.1
        }]
      };
    } 

    const canvas = this.renderer.createElement('canvas');
    this.renderer.setAttribute(canvas, 'id', 'barChart');
  
    const container = this.el.nativeElement.querySelector('#contenedor-barchart');
    this.renderer.appendChild(container, canvas);
  
    if(data!==null){
      this.chart = new Chart(canvas, {
        type: 'bar' as ChartType, 
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
    
      
    }
    this.chart.canvas.width = 100;
    this.chart.canvas.height = 100;
    
  }

  actualizarChart() {
    const datasetsByCompany: { [key: string]: { label: string; data: number[]; backgroundColor: string[]; borderColor: string[]; borderWidth: number } } = {};
  
    this.apiData.forEach((row: { categoria: string; totalResults: number }, index: number) => {
      const categoria = row.categoria;
      const totalResults = row.totalResults;
  
      if (!datasetsByCompany[categoria]) {
        datasetsByCompany[categoria] = {
          label: 'Valores de ' + categoria,
          data: [],
          backgroundColor: [this.backgroundColorCat[index]],
          borderColor: [this.borderColorCat[index]],
          borderWidth: 1
        };
      }
  
      datasetsByCompany[categoria].data[index] = totalResults;
      datasetsByCompany[categoria].backgroundColor[index] = this.backgroundColorCat[index];
      datasetsByCompany[categoria].borderColor[index] = this.borderColorCat[index];
    });
  
    this.chart.data.datasets = Object.values(datasetsByCompany);
    this.chart.update();
    console.log(this.chart.data)
  }
  
}

