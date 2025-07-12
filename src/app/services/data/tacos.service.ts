import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ITaco, IAlimento, ITacoContent } from '../../interfaces/definitions';
import { catchError, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment.development';

const API_URL = 'http://localhost:3000/tacos';

@Injectable({
  providedIn: 'root',
})
export class TacosService {
  constructor(private readonly httpClient: HttpClient) {}

  getTacoMasEconomico(): Observable<ITaco | null> {
    const url = environment.mockeable
      ? 'json/get-taco-mas-economico.json'
      : `${API_URL}/stats/cheapest`;
    return this.httpClient.get<ITaco>(url).pipe(catchError(() => of(null)));
  }
  getTacoMasCostoso(): Observable<ITaco | null> {
    const url = environment.mockeable
      ? 'json/get-taco-mas-costoso.json'
      : `${API_URL}/stats/most-expensive`;
    return this.httpClient.get<ITaco>(url).pipe(catchError(() => of(null)));
  }
  getValorPromedio(): Observable<number | null> {
    const url = environment.mockeable
      ? 'json/get-taco-valor-promedio.json'
      : `${API_URL}/stats/average-price`;
    return this.httpClient.get<number>(url).pipe(catchError(() => of(null)));
  }
  getTacos(): Observable<ITaco[]> {
    const url = environment.mockeable ? 'json/get-tacos.json' : API_URL;
    return this.httpClient.get<ITaco[]>(url);
  }
  getTortillas(): Observable<ITacoContent[]> {
    const url = environment.mockeable ? 'json/get-tortillas.json' : API_URL;
    return this.httpClient.get<ITacoContent[]>(url);
  }
  getAlimentos(): Observable<IAlimento[]> {
    const url = environment.mockeable ? 'json/get-alimentos.json' : API_URL;
    return this.httpClient.get<IAlimento[]>(url);
  }

  createTaco(taco: ITaco): Observable<ITaco> {
    return this.httpClient.post<ITaco>(API_URL, taco);
  }
}
