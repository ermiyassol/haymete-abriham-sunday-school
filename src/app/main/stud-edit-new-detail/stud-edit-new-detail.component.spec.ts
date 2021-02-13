import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudEditNewDetailComponent } from './stud-edit-new-detail.component';

describe('StudEditNewDetailComponent', () => {
  let component: StudEditNewDetailComponent;
  let fixture: ComponentFixture<StudEditNewDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudEditNewDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudEditNewDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
