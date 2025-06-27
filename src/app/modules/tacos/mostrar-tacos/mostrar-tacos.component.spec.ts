import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostrarTacosComponent } from './mostrar-tacos.component';

describe('MostrarTacosComponent', () => {
  let component: MostrarTacosComponent;
  let fixture: ComponentFixture<MostrarTacosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MostrarTacosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MostrarTacosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
