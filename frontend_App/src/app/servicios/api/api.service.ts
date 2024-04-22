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

  obtenerDatos(puntoFinal: string, parametros?: HttpParams): Observable<any> {
    let cabeceras = this.cabeceras;
    return parametros ? this.http.get<any>(`${this.url}/${puntoFinal}`, { params: parametros, headers: cabeceras }) : this.http.get<any>(`${this.url}/${puntoFinal}`, { headers: cabeceras });
  }

  crearRegistro(puntoFinal: string, cuerpo: any): Observable<any> {
    let cabeceras = this.cabeceras;
    return this.http.post<any>(`${this.url}/${puntoFinal}`, cuerpo, { headers: cabeceras });
  }

  editarRegistro(puntoFinal: string, cuerpo: any, parametros?: HttpParams): Observable<any> {
    let cabeceras = this.cabeceras;
    return parametros ? this.http.put<any>(`${this.url}/${puntoFinal}`, cuerpo, { params: parametros, headers: cabeceras }) : this.http.put<any>(`${this.url}/${puntoFinal}`, cuerpo, { headers: cabeceras });
  }

  eliminarRegistro(puntoFinal: string, parametros?: HttpParams): Observable<any> {
    let cabeceras = this.cabeceras;
    return parametros ? this.http.delete<any>(`${this.url}/${puntoFinal}`, { params: parametros, headers: cabeceras }) : this.http.delete<any>(`${this.url}/${puntoFinal}`, { headers: cabeceras });
  }
}
