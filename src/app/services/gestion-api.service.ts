import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Article, RespuestaNoticias } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class GestionApiService {

  apiKey: string = environment.apiKey;
  apiUrl: string = environment.apiUrl;

  private datosSubject: BehaviorSubject<{ categoria: string; totalResults: number }|undefined> = new BehaviorSubject<{ categoria: string; totalResults: number }|undefined>(undefined);
  public datos$: Observable<{ categoria: string; totalResults: number }|undefined> = this.datosSubject.asObservable();

  constructor(private leerArticulosServicioHttp: HttpClient) { }

  public cargarCategoria(categoria: string) {

    let respuesta: Observable<RespuestaNoticias> = this.leerArticulosServicioHttp.get<RespuestaNoticias>("https://newsapi.org/v2/top-headlines?country=us&category=" + categoria + "&apiKey=" + this.apiKey);
    console.log("respuesta: "+respuesta);
    respuesta.subscribe( data => {
      if (data && data.totalResults !== undefined) {

        this.datosSubject.next({ categoria: categoria, totalResults: data.totalResults });
      } else {
        console.error('La propiedad totalResults no está definida en la respuesta:', data);
      }
    });
  }
}

