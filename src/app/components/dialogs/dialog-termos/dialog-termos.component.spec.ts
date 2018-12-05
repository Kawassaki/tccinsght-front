import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogTermosComponent } from './dialog-termos.component';

describe('DialogTermosComponent', () => {
  let component: DialogTermosComponent;
  let fixture: ComponentFixture<DialogTermosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogTermosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogTermosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
