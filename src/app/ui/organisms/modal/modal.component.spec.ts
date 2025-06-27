import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UIModalComponent } from './modal.component';

describe('ModalComponent', () => {
  let component: UIModalComponent;
  let fixture: ComponentFixture<UIModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UIModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UIModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
