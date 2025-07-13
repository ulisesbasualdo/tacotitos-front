import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalsasComponent } from './salsas.component';
import { provideHttpClient } from '@angular/common/http';

describe('SalsasComponent', () => {
  let component: SalsasComponent;
  let fixture: ComponentFixture<SalsasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalsasComponent],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(SalsasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
