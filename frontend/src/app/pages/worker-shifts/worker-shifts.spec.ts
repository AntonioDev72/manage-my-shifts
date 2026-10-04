import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerShifts } from './worker-shifts';

describe('WorkerShifts', () => {
  let component: WorkerShifts;
  let fixture: ComponentFixture<WorkerShifts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkerShifts],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkerShifts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
