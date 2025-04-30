import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EucharistComponent } from './eucharist.component';

describe('EucharistComponent', () => {
  let component: EucharistComponent;
  let fixture: ComponentFixture<EucharistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EucharistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EucharistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
