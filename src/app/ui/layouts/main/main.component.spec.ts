import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UIMainLayoutComponent } from './main.component';

describe('MainComponent', () => {
  let component: UIMainLayoutComponent;
  let fixture: ComponentFixture<UIMainLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UIMainLayoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UIMainLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
