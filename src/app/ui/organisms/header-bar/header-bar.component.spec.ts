import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UIHeaderBarComponent } from './header-bar.component';

describe('HeaderBarComponent', () => {
  let component: UIHeaderBarComponent;
  let fixture: ComponentFixture<UIHeaderBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UIHeaderBarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UIHeaderBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
