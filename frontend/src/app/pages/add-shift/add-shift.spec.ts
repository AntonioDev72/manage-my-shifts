import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddShift } from './add-shift';

describe('AddShift', () => {
  let component: AddShift;
  let fixture: ComponentFixture<AddShift>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddShift],
    }).compileComponents();

    fixture = TestBed.createComponent(AddShift);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
