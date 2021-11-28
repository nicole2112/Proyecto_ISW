import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoConfirmationComponent } from './no-confirmation.component';

describe('NoConfirmationComponent', () => {
  let component: NoConfirmationComponent;
  let fixture: ComponentFixture<NoConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoConfirmationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
