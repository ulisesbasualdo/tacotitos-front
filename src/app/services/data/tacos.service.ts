import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ITaco } from '../../interfaces/i-taco';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:3000/tacos';

@Injectable({
  providedIn: 'root',
})
export class TacosService {
  constructor(private readonly httpClient: HttpClient) {}

  getTacoMasEconomico(): Observable<ITaco> {
    return this.httpClient.get<ITaco>(`${API_URL}/stats/cheapest`);
  }
  getTacoMasCostoso(): Observable<ITaco> {
    return this.httpClient.get<ITaco>(`${API_URL}/stats/most-expensive`);
  }
  getValorPromedio(): Observable<number> {
    return this.httpClient.get<number>(`${API_URL}/stats/average-price`);
  }
  getTacos(): Observable<ITaco[]> {
    return this.httpClient.get<ITaco[]>(API_URL);
  }

  createTaco(taco: ITaco): Observable<ITaco> {
    return this.httpClient.post<ITaco>(API_URL, taco);
  }
}
