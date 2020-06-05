import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleCarComponent } from './singl-car.component';

describe('SinglCarComponent', () => {
  let component: SingleCarComponent;
  let fixture: ComponentFixture<SingleCarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SingleCarComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleCarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
