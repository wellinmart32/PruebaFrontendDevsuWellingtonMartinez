import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private url = 'https://tribu-ti-staffing-desarrollo-afangwbmcrhucqfh.z01.azurefd.net/ipf-msa-productosfinancieros';
  cabeceras = new HttpHeaders().set(
    'authorId', '92'
  );

  constructor(
    private http: HttpClient
  ) { }

  obtenerDatos(endpoint: string, parametros?: HttpParams): Observable<any> {
    let cabeceras = this.cabeceras;
    return parametros ? this.http.get<any>(`${this.url}/${endpoint}`, { params: parametros, headers: cabeceras }) : this.http.get<any>(`${this.url}/${endpoint}`, { headers: cabeceras });
  }
}
