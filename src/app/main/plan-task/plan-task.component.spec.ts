import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanTaskComponent } from './plan-task.component';

describe('PlanTaskComponent', () => {
  let component: PlanTaskComponent;
  let fixture: ComponentFixture<PlanTaskComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlanTaskComponent]
    });
    fixture = TestBed.createComponent(PlanTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
