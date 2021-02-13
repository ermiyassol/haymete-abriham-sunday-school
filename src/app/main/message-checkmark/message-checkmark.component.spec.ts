import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageCheckmarkComponent } from './message-checkmark.component';

describe('MessageCheckmarkComponent', () => {
  let component: MessageCheckmarkComponent;
  let fixture: ComponentFixture<MessageCheckmarkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageCheckmarkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageCheckmarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
