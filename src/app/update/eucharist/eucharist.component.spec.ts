import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EucharistUpdateComponent } from './eucharist.component';

describe('EucharistUpdateComponent', () => {
  let component: EucharistUpdateComponent;
  let fixture: ComponentFixture<EucharistUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EucharistUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EucharistUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
