import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarriageCardComponent } from './marriage-card.component';

describe('MarriageCardComponent', () => {
  let component: MarriageCardComponent;
  let fixture: ComponentFixture<MarriageCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarriageCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarriageCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
