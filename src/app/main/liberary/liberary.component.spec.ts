import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiberaryComponent } from './liberary.component';

describe('LiberaryComponent', () => {
  let component: LiberaryComponent;
  let fixture: ComponentFixture<LiberaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiberaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiberaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
