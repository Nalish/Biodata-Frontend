import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarriageUpdateComponent } from './marriage.component';

describe('MarriageUpdateComponent', () => {
  let component: MarriageUpdateComponent;
  let fixture: ComponentFixture<MarriageUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarriageUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarriageUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
