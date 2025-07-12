import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearTacoFormComponent } from './crear-taco-form.component';
import { provideHttpClient } from '@angular/common/http';

describe('CrearTacoFormComponent', () => {
  let component: CrearTacoFormComponent;
  let fixture: ComponentFixture<CrearTacoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearTacoFormComponent],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(CrearTacoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
