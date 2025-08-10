import { HttpClient, httpResource } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ITaco,
  IAlimento,
  ITacoContent,
  ITacoStats,
} from '../../interfaces/definitions';
import { catchError, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment.development';

const API_URL = 'http://localhost:3000/tacos';

@Injectable({
  providedIn: 'root',
})
export class TacosService {
  constructor(private readonly httpClient: HttpClient) {}

  getTacoMasEconomico = httpResource<ITacoStats>(
    () => `${API_URL}/stats/cheapest`
  );

  // getTacoMasEconomico(): Observable<ITaco | null> {
  //   const url = environment.mockeable
  //     ? 'json/get-taco-mas-economico.json'
  //     : `${API_URL}/stats/cheapest`;
  //   return this.httpClient.get<ITaco>(url).pipe(catchError(() => of(null)));
  // }

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

  getTortillas = httpResource<ITacoContent[]>(() => `${API_URL}/tortillas`);

  getSalsas(): Observable<IAlimento[] | null> {
    const url = environment.mockeable
      ? 'json/get-salsas.json'
      : `${API_URL}/salsas`;
    return this.httpClient
      .get<IAlimento[]>(url)
      .pipe(catchError(() => of(null)));
  }
  getAlimentos(): Observable<IAlimento[] | null> {
    const url = environment.mockeable
      ? 'json/get-alimentos.json'
      : `${API_URL}/alimentos`;
    return this.httpClient
      .get<IAlimento[]>(url)
      .pipe(catchError(() => of(null)));
  }

  createTaco(taco: ITaco): Observable<ITaco> {
    return this.httpClient.post<ITaco>(API_URL, taco);
  }
  editSalsa(salsa: IAlimento): Observable<IAlimento> {
    if (environment.mockeable) {
      return of(salsa);
    } else {
      return this.httpClient.put<IAlimento>(
        `${API_URL}/salsas/${salsa.id}`,
        salsa
      );
    }
  }
  editAlimento(alimento: IAlimento): Observable<IAlimento> {
    if (environment.mockeable) {
      return of(alimento);
    } else {
      return this.httpClient.put<IAlimento>(
        `${API_URL}/alimentos/${alimento.id}`,
        alimento
      );
    }
  }

  addTortilla(tortilla: Partial<ITacoContent>): Observable<ITacoContent> {
    if (environment.mockeable) {
      const tortillaCompleta: ITacoContent = {
        id: '70',
        nombre: tortilla.nombre ?? '-',
        precio: tortilla.precio ?? 0,
      };
      return of(tortillaCompleta);
    } else {
      return this.httpClient.post<ITacoContent>(
        `${API_URL}/tortillas`,
        tortilla
      );
    }
  }

  editTortilla(tortilla: ITacoContent): Observable<ITacoContent> {
    if (environment.mockeable) {
      return of(tortilla);
    } else {
      return this.httpClient.put<ITacoContent>(
        `${API_URL}/tortillas/${tortilla.id}`,
        tortilla
      );
    }
  }

  deleteTortilla(id: string): Observable<void> {
    if (environment.mockeable) {
      return of();
    } else {
      return this.httpClient.delete<void>(`${API_URL}/tortillas/${id}`);
    }
  }

  addAlimento(alimento: Partial<IAlimento>): Observable<IAlimento> {
    if (environment.mockeable) {
      const alimentoCompleto: IAlimento = {
        id: '70',
        nombre: alimento.nombre ?? '-',
        precio: alimento.precio ?? 0,
        tipoAlimento: 'alimentoTortilla',
      };
      return of(alimentoCompleto);
    } else {
      return this.httpClient.post<IAlimento>(`${API_URL}/alimentos`, alimento);
    }
  }

  deleteAlimento(id: string): Observable<void> {
    if (environment.mockeable) {
      return of();
    } else {
      return this.httpClient.delete<void>(`${API_URL}/alimentos/${id}`);
    }
  }

  addSalsa(salsa: Partial<IAlimento>): Observable<IAlimento> {
    if (environment.mockeable) {
      const salsaCompleta: IAlimento = {
        id: '70',
        nombre: salsa.nombre ?? '-',
        precio: salsa.precio ?? 0,
        tipoAlimento: 'salsa',
      };
      return of(salsaCompleta);
    } else {
      return this.httpClient.post<IAlimento>(`${API_URL}/salsas`, salsa);
    }
  }

  deleteSalsa(id: string): Observable<void> {
    if (environment.mockeable) {
      return of();
    } else {
      return this.httpClient.delete<void>(`${API_URL}/salsas/${id}`);
    }
  }
}
