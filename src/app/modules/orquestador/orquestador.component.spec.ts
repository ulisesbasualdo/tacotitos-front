import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrquestadorComponent } from './orquestador.component';

xdescribe('OrquestadorComponent', () => {
  let component: OrquestadorComponent;
  let fixture: ComponentFixture<OrquestadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrquestadorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrquestadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
