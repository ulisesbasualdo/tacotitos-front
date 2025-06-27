import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearTacoFormComponent } from './crear-taco-form.component';

describe('CrearTacoFormComponent', () => {
  let component: CrearTacoFormComponent;
  let fixture: ComponentFixture<CrearTacoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearTacoFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CrearTacoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
