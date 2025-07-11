import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TipoTortillaComponent } from './tipo-tortilla.component';
import { provideHttpClient } from '@angular/common/http';

describe('TipoTortillaComponent', () => {
  let component: TipoTortillaComponent;
  let fixture: ComponentFixture<TipoTortillaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipoTortillaComponent],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(TipoTortillaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
