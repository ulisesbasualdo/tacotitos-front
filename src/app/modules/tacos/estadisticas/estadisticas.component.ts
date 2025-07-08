import { Component } from '@angular/core';
import { CardComponent } from '../../../ui/molecules/card/card.component';

@Component({
  selector: 'app-estadisticas',
  imports: [CardComponent],
  template: `
    <ui-card titleText="Estadísticas" width100>
      <div cardBody>
        <table>
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
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
            </tr>
            <tr>
              <td>Taco más económico</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div cardFooter>Valor promedio de un taco: 20 pesos</div>
    </ui-card>
  `,
  styles: `
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th,
    td {
      padding: 8px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    th {
      background-color: #f2f2f2;
    }
  `,
})
export class EstadisticasComponent {}
