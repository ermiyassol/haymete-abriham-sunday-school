import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MezmurCheckmarkComponent } from './mezmur-checkmark.component';

describe('MezmurCheckmarkComponent', () => {
  let component: MezmurCheckmarkComponent;
  let fixture: ComponentFixture<MezmurCheckmarkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MezmurCheckmarkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MezmurCheckmarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
