import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogFaqComponent } from './dialog-faq.component';

describe('DialogFaqComponent', () => {
  let component: DialogFaqComponent;
  let fixture: ComponentFixture<DialogFaqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogFaqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
