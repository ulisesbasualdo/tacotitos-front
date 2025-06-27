import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UIBtnGroupLayoutComponent } from './btn-group.component';

describe('BtnGroupComponent', () => {
  let component: UIBtnGroupLayoutComponent;
  let fixture: ComponentFixture<UIBtnGroupLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UIBtnGroupLayoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UIBtnGroupLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
