import { Component, OnInit } from '@angular/core';
import { CardComponent } from '../../../ui/molecules/card/card.component';
import { ITaco } from '../../../interfaces/definitions';
import { TacosService } from '../../../services/data/tacos.service';

@Component({
  selector: 'app-estadisticas',
  imports: [CardComponent],
  template: `
    <ui-card titleText="Estadísticas" width100>
      <div cardBody>
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
                <td>{{ tacoMasCostoso?.precio || '-' }}</td>
                <td>{{ tacoMasCostoso?.tortilla?.nombre || '-' }}</td>
                <td>{{ tacoMasCostoso?.salsa?.nombre || '-' }}</td>
                <td>{{ getAlimentosTacoCostoso() || '-' }}</td>
              </tr>
              <tr>
                <td>Taco más económico</td>
                <td>{{ tacoMasEconomico?.precio || '-' }}</td>
                <td>{{ tacoMasEconomico?.tortilla?.nombre || '-' }}</td>
                <td>{{ tacoMasEconomico?.salsa?.nombre || '-' }}</td>
                <td>{{ getAlimentosTacoEconomico() || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div cardFooter>
        Valor promedio de un taco:
        {{ valorPromedioTaco ? valorPromedioTaco : 'sin datos' }}
      </div>
    </ui-card>
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
export class EstadisticasComponent implements OnInit {
  tacoMasCostoso: ITaco | null = null;
  tacoMasEconomico: ITaco | null = null;
  valorPromedioTaco: number | null = null;

  constructor(private readonly tacosService: TacosService) {}
  ngOnInit(): void {
    this.tacosService.getTacoMasCostoso().subscribe(taco => {
      if (!taco) {
        console.log('no se pudo obtener el taco más costoso');
        return;
      }
      this.tacoMasCostoso = taco;
    });
    this.tacosService.getTacoMasEconomico().subscribe(taco => {
      if (!taco) {
        console.log('no se pudo obtener el taco más económico');
        return;
      }
      this.tacoMasEconomico = taco;
    });
    this.tacosService.getValorPromedio().subscribe(valor => {
      if (!valor) {
        console.log('no se pudo obtener el valor promedio');
        return;
      }
      this.valorPromedioTaco = valor;
    });
  }

  getAlimentosTacoCostoso(): string {
    return this.tacoMasCostoso?.alimentos?.map(a => a.nombre).join(', ') || '-';
  }

  getAlimentosTacoEconomico(): string {
    return (
      this.tacoMasEconomico?.alimentos?.map(a => a.nombre).join(', ') || '-'
    );
  }
}
