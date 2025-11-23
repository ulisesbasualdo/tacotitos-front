import { HttpClient, httpResource } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ITaco, ITacoContent } from '../../interfaces/definitions';
import { catchError, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment.development';

export const API_URL = 'http://localhost:3000/tacos';

@Injectable({
  providedIn: 'root',
})
export class TacosService {
  private readonly httpClient = inject(HttpClient);

  getTacos(): Observable<ITaco[]> {
    const url = environment.mockeable ? 'json/get-tacos.json' : API_URL;
    return this.httpClient.get<ITaco[]>(url);
  }

  getTortillas = httpResource<ITacoContent[]>(() => `${API_URL}/tortillas`);

  getTortillasObservable(): Observable<ITacoContent[] | null> {
    const url = environment.mockeable
      ? 'json/get-tortillas.json'
      : `${API_URL}/tortillas`;

    return this.httpClient
      .get<ITacoContent[]>(url)
      .pipe(catchError(() => of(null)));
  }

  // Sauces
  getSauces(): Observable<ITacoContent[] | null> {
    const url = environment.mockeable
      ? 'json/get-salsas.json'
      : `${API_URL}/sauces`;
    return this.httpClient
      .get<ITacoContent[]>(url)
      .pipe(catchError(() => of(null)));
  }

  addSauce(sauce: Partial<ITacoContent>): Observable<ITacoContent> {
    if (environment.mockeable) {
      const sauceCompleta: ITacoContent = {
        id: 70,
        name: sauce.name ?? '-',
        price: sauce.price ?? 0,
      };
      return of(sauceCompleta);
    } else {
      return this.httpClient.post<ITacoContent>(`${API_URL}/sauces`, sauce);
    }
  }

  editSauce(sauce: ITacoContent): Observable<ITacoContent> {
    if (environment.mockeable) {
      return of(sauce);
    } else {
      return this.httpClient.put<ITacoContent>(
        `${API_URL}/sauces/${sauce.id}`,
        sauce
      );
    }
  }

  deleteSauce(id: number): Observable<void> {
    if (environment.mockeable) {
      return of();
    } else {
      return this.httpClient.delete<void>(`${API_URL}/sauces/${id}`);
    }
  }

  // Fillings
  getFillings(): Observable<ITacoContent[] | null> {
    const url = environment.mockeable
      ? 'json/get-alimentos.json'
      : `${API_URL}/fillings`;
    return this.httpClient
      .get<ITacoContent[]>(url)
      .pipe(catchError(() => of(null)));
  }

  addFilling(filling: Partial<ITacoContent>): Observable<ITacoContent> {
    if (environment.mockeable) {
      const fillingCompleto: ITacoContent = {
        id: 70,
        name: filling.name ?? '-',
        price: filling.price ?? 0,
      };
      return of(fillingCompleto);
    } else {
      return this.httpClient.post<ITacoContent>(`${API_URL}/fillings`, filling);
    }
  }

  editFilling(filling: ITacoContent): Observable<ITacoContent> {
    if (environment.mockeable) {
      return of(filling);
    } else {
      return this.httpClient.put<ITacoContent>(
        `${API_URL}/fillings/${filling.id}`,
        filling
      );
    }
  }

  deleteFilling(id: number): Observable<void> {
    if (environment.mockeable) {
      return of();
    } else {
      return this.httpClient.delete<void>(`${API_URL}/fillings/${id}`);
    }
  }

  // Tortillas
  addTortilla(tortilla: Partial<ITacoContent>): Observable<ITacoContent> {
    if (environment.mockeable) {
      const tortillaCompleta: ITacoContent = {
        id: 70,
        name: tortilla.name ?? '-',
        price: tortilla.price ?? 0,
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

  deleteTortilla(id: number): Observable<void> {
    if (environment.mockeable) {
      return of();
    } else {
      return this.httpClient.delete<void>(`${API_URL}/tortillas/${id}`);
    }
  }

  // Tacos
  createTaco(taco: ITaco): Observable<ITaco> {
    return this.httpClient.post<ITaco>(API_URL, taco);
  }
}
