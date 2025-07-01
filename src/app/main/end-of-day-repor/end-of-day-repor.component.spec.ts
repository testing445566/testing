import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndOfDayReporComponent } from './end-of-day-repor.component';

describe('EndOfDayReporComponent', () => {
  let component: EndOfDayReporComponent;
  let fixture: ComponentFixture<EndOfDayReporComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EndOfDayReporComponent]
    });
    fixture = TestBed.createComponent(EndOfDayReporComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
