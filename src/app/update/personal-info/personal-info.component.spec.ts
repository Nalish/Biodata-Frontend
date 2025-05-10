import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalInfoUpdateComponent } from './personal-info.component';

describe('PersonalInfoUpdateComponent', () => {
  let component: PersonalInfoUpdateComponent;
  let fixture: ComponentFixture<PersonalInfoUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalInfoUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalInfoUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
