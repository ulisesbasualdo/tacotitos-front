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
  getTortillas(): Observable<ITacoContent[] | null> {
    const url = environment.mockeable ? 'json/get-tortillas.json' : API_URL;
    return this.httpClient
      .get<ITacoContent[]>(`${url}/tortillas`)
      .pipe(catchError(() => of(null)));
  }
  getSalsas(): Observable<IAlimento[] | null> {
    const url = environment.mockeable ? 'json/get-salsas.json' : API_URL;
    return this.httpClient
      .get<IAlimento[]>(url)
      .pipe(catchError(() => of(null)));
  }
  getAlimentos(): Observable<IAlimento[] | null> {
    const url = environment.mockeable ? 'json/get-alimentos.json' : API_URL;
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
      return this.httpClient.put<IAlimento>(`${API_URL}/${salsa.id}`, salsa);
    }
  }
  editAlimento(alimento: IAlimento): Observable<IAlimento> {
    if (environment.mockeable) {
      return of(alimento);
    } else {
      return this.httpClient.put<IAlimento>(
        `${API_URL}/${alimento.id}`,
        alimento
      );
    }
  }

  addTortilla(tortilla: Partial<ITacoContent>): Observable<ITacoContent> {
    if (environment.mockeable) {
      const tortillaCompleta: ITacoContent = {
        id: 70,
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
        `${API_URL}/${tortilla.id}`,
        tortilla
      );
    }
  }
  addAlimento(alimento: Partial<IAlimento>): Observable<IAlimento> {
    if (environment.mockeable) {
      const alimentoCompleto: IAlimento = {
        id: 70,
        nombre: alimento.nombre ?? '-',
        precio: alimento.precio ?? 0,
        tipoAlimento: 'alimentoTortilla',
      };
      return of(alimentoCompleto);
    } else {
      return this.httpClient.post<IAlimento>(`${API_URL}`, alimento);
    }
  }
}
