import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaptismUpdateComponent } from './baptism.component';

describe('BaptismUpdateComponent', () => {
  let component: BaptismUpdateComponent;
  let fixture: ComponentFixture<BaptismUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaptismUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaptismUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
