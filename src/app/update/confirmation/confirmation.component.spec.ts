import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationUpdateComponent } from './confirmation.component';

describe('ConfirmationUpdateComponent', () => {
  let component: ConfirmationUpdateComponent;
  let fixture: ComponentFixture<ConfirmationUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmationUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmationUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
