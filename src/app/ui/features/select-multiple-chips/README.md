# SelectMultipleChipsComponent

Un componente moderno y reutilizable para selección múltiple con chips, completamente compatible con formularios reactivos de Angular y que implementa el patrón Mediator para evitar la superposición de dropdowns.

## Características

- ✅ **Compatible con formularios reactivos** - Implementa `ControlValueAccessor`
- ✅ **Patrón Mediator** - Solo un dropdown abierto a la vez
- ✅ **UI moderna** - Diseño hermoso con gradientes y animaciones fluidas
- ✅ **Búsqueda en tiempo real** - Filtra opciones mientras escribes
- ✅ **Accesibilidad** - Soporte completo para teclado y screen readers
- ✅ **Animaciones suaves** - Efectos de entrada y salida para chips
- ✅ **Responsive** - Se adapta a diferentes tamaños de pantalla
- ✅ **Validaciones** - Integración completa con Angular Forms

## Instalación

El componente está listo para usar, solo impórtalo donde lo necesites:

```typescript
import { SelectMultipleChipsComponent } from './select-multiple-chips.component';
```

## Uso Básico

### Con Input/Output (Template-driven)

```typescript
@Component({
  template: `
    <app-select-multiple-chips
      [options]="opciones"
      [selectedValues]="valoresSeleccionados"
      [placeholder]="'Selecciona opciones...'"
      (selectionChange)="onSelectionChange($event)" />
  `,
})
export class MiComponente {
  opciones: ChipItem[] = [
    { id: '1', label: 'Opción 1', value: 'valor1' },
    { id: '2', label: 'Opción 2', value: 'valor2' },
    { id: '3', label: 'Opción 3', value: 'valor3', disabled: true },
  ];

  valoresSeleccionados: any[] = [];

  onSelectionChange(selected: ChipItem[]): void {
    this.valoresSeleccionados = selected.map(item => item.value);
  }
}
```

### Con Formularios Reactivos (Recomendado)

```typescript
@Component({
  imports: [ReactiveFormsModule, SelectMultipleChipsComponent],
  template: `
    <form [formGroup]="miFormulario">
      <app-select-multiple-chips
        formControlName="ingredientes"
        [options]="opciones"
        [placeholder]="'Selecciona ingredientes...'"
        [maxSelections]="5" />

      <!-- Mostrar errores de validación -->
      @if (
        miFormulario.get('ingredientes')?.invalid &&
        miFormulario.get('ingredientes')?.touched
      ) {
        <div class="error">
          @if (miFormulario.get('ingredientes')?.errors?.['required']) {
            <span>Debes seleccionar al menos un ingrediente</span>
          }
        </div>
      }
    </form>
  `,
})
export class MiComponente {
  miFormulario = new FormGroup({
    ingredientes: new FormControl<string[]>([], [Validators.required]),
  });

  opciones: ChipItem[] = [
    { id: 'pollo', label: 'Pollo', value: 'pollo' },
    { id: 'carne', label: 'Carne', value: 'carne' },
    { id: 'verdura', label: 'Verdura', value: 'verdura' },
  ];
}
```

## API

### Inputs

| Propiedad           | Tipo             | Valor por defecto               | Descripción                                  |
| ------------------- | ---------------- | ------------------------------- | -------------------------------------------- |
| `options`           | `ChipItem[]`     | `[]`                            | Lista de opciones disponibles                |
| `selectedValues`    | `any[]`          | `[]`                            | Valores seleccionados (modo template-driven) |
| `placeholder`       | `string`         | `'Seleccionar elementos...'`    | Texto placeholder del contenedor             |
| `searchPlaceholder` | `string`         | `'Buscar...'`                   | Texto placeholder del campo de búsqueda      |
| `noOptionsText`     | `string`         | `'No hay opciones disponibles'` | Texto cuando no hay opciones                 |
| `searchable`        | `boolean`        | `true`                          | Habilita/deshabilita la búsqueda             |
| `disabled`          | `boolean`        | `false`                         | Deshabilita el componente                    |
| `maxSelections`     | `number \| null` | `null`                          | Límite máximo de selecciones                 |

### Outputs

| Evento            | Tipo         | Descripción                                   |
| ----------------- | ------------ | --------------------------------------------- |
| `selectionChange` | `ChipItem[]` | Se emite cuando cambia la selección           |
| `searchChange`    | `string`     | Se emite cuando cambia el término de búsqueda |

### Interfaz ChipItem

```typescript
interface ChipItem {
  id: string | number; // Identificador único
  label: string; // Texto que se muestra
  value: any; // Valor asociado
  disabled?: boolean; // Si la opción está deshabilitada
}
```

## Ejemplos Avanzados

### Con Validador Personalizado

```typescript
// Validador que requiere al menos 2 elementos
function minArrayLength(min: number) {
  return (control: AbstractControl) => {
    const value = control.value;
    if (!value || !Array.isArray(value) || value.length < min) {
      return {
        minlength: { requiredLength: min, actualLength: value?.length || 0 },
      };
    }
    return null;
  };
}

// En el componente
miFormulario = new FormGroup({
  ingredientes: new FormControl<string[]>(
    [],
    [Validators.required, minArrayLength(2)]
  ),
});
```

### Con Datos Dinámicos

```typescript
@Component({
  template: `
    <app-select-multiple-chips
      [options]="opcionesFiltradas"
      formControlName="tags"
      [searchable]="true"
      (searchChange)="onBuscar($event)" />
  `
})
export class ComponenteDinamico {
  todasLasOpciones: ChipItem[] = [...]; // Tu lista completa
  opcionesFiltradas = signal<ChipItem[]>([]);

  constructor() {
    this.opcionesFiltradas.set(this.todasLasOpciones);
  }

  onBuscar(termino: string): void {
    const filtradas = this.todasLasOpciones.filter(opcion =>
      opcion.label.toLowerCase().includes(termino.toLowerCase())
    );
    this.opcionesFiltradas.set(filtradas);
  }
}
```

### Integración con Servicios

```typescript
@Component({
  template: `
    <app-select-multiple-chips
      [options]="categorias"
      formControlName="categorias"
      [placeholder]="'Cargando categorías...'"
      [disabled]="cargando" />
  `,
})
export class ComponenteConServicio {
  categorias = signal<ChipItem[]>([]);
  cargando = signal(true);

  constructor(private categoriasService: CategoriasService) {
    this.cargarCategorias();
  }

  async cargarCategorias(): Promise<void> {
    try {
      this.cargando.set(true);
      const datos = await this.categoriasService.obtenerCategorias();
      const opciones = datos.map(cat => ({
        id: cat.id,
        label: cat.nombre,
        value: cat.id,
        disabled: !cat.activa,
      }));
      this.categorias.set(opciones);
    } finally {
      this.cargando.set(false);
    }
  }
}
```

## Personalización de Estilos

El componente utiliza CSS moderno con variables CSS que puedes personalizar:

```css
app-select-multiple-chips {
  --chip-bg: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  --chip-color: white;
  --border-color: #e5e7eb;
  --border-radius: 12px;
  --focus-color: #3b82f6;
}
```

## Patrón Mediator

El componente implementa automáticamente el patrón Mediator para coordinar con otros dropdowns (como filtros). Esto significa que:

- Solo un dropdown puede estar abierto a la vez
- Al abrir un dropdown, se cierran automáticamente todos los demás
- Funciona automáticamente sin configuración adicional

## Mejores Prácticas

1. **Usa formularios reactivos** para mayor control y validación
2. **Proporciona IDs únicos** en los ChipItems para un mejor rendimiento
3. **Limita las opciones** para evitar dropdowns muy largos
4. **Usa maxSelections** cuando sea apropiado para la UX
5. **Agrega validaciones apropiadas** según las reglas de negocio
6. **Considera la búsqueda** para listas grandes de opciones

## Compatibilidad

- ✅ Angular 17+
- ✅ TypeScript 5+
- ✅ Formularios reactivos y template-driven
- ✅ SSR (Server-Side Rendering)
- ✅ Navegadores modernos
- ✅ Accesibilidad (WCAG 2.1)

## Demo

Ejecuta el componente `ChipsDemoComponent` para ver todos los ejemplos en acción, incluyendo:

- Formularios reactivos con validaciones
- Modo input/output tradicional
- Diferentes configuraciones y casos de uso
- Estados de error y validación
- Integración con el patrón Mediator
