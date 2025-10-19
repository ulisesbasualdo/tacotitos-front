import { Component } from '@angular/core';
import { ITacoStats } from '../../../interfaces/definitions';
import { API_URL } from '../../../services/data/tacos.service';
import { httpResource } from '@angular/common/http';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-estadisticas',
  imports: [DecimalPipe],
  template: `
    <div class="table-container">
      <table class="table">
        <thead>
          <tr>
            <th></th>
            <th>Valor</th>
            <th>Tipo Tortilla</th>
            <th>Salsa</th>
            <th>Alimentos</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Taco más costoso</td>
            @if (expensiveTacoResource.hasValue()) {
              <td>
                {{
                  (expensiveTacoResource.value().value | number: '1.2-2') || '-'
                }}
              </td>
              <td>{{ expensiveTacoResource.value().tortillaType || '-' }}</td>
              <td>{{ expensiveTacoResource.value().sauce || '-' }}</td>
              <td>{{ expensiveTacoResource.value().fillings || '-' }}</td>
            }
            @if (
              expensiveTacoResource.error() &&
              !expensiveTacoResource.isLoading()
            ) {
              <td>error al obtener el taco más costoso</td>
            }
            @if (expensiveTacoResource.isLoading()) {
              <td>Cargando...</td>
            }
          </tr>
          <tr>
            <td>Taco más económico</td>

            @if (cheapestTacoResource.hasValue()) {
              <td>
                {{
                  (cheapestTacoResource.value().value | number: '1.2-2') || '-'
                }}
              </td>
              <td>{{ cheapestTacoResource.value().tortillaType || '-' }}</td>
              <td>{{ cheapestTacoResource.value().sauce || '-' }}</td>
              <td>{{ cheapestTacoResource.value().fillings || '-' }}</td>
            }
            @if (
              cheapestTacoResource.error() && !cheapestTacoResource.isLoading()
            ) {
              <td>error al obtener el taco más económico</td>
            }
            @if (cheapestTacoResource.isLoading()) {
              <td>Cargando...</td>
            }
          </tr>
        </tbody>
      </table>
    </div>
    Valor promedio de un taco:
    {{
      averageTacoResource.hasValue()
        ? (averageTacoResource.value().averagePrice | number: '1.2-2')
        : 'sin datos'
    }}
  `,
  styles: `
    .table-container {
      overflow-x: auto;
      width: 100%;
    }
    tbody {
      text-wrap: nowrap;
    }
  `,
})
export class EstadisticasComponent {
  cheapestTacoResource = httpResource<ITacoStats>(
    () => `${API_URL}/stats/cheapest`
  );
  expensiveTacoResource = httpResource<ITacoStats>(
    () => `${API_URL}/stats/most-expensive`
  );

  averageTacoResource = httpResource<{ averagePrice: number }>(
    () => `${API_URL}/stats/average-price`
  );
}
