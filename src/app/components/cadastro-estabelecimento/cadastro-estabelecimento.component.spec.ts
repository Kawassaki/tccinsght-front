import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroEstabelecimentoComponent } from './cadastro-estabelecimento.component';

describe('CadastroEstabelecimentoComponent', () => {
  let component: CadastroEstabelecimentoComponent;
  let fixture: ComponentFixture<CadastroEstabelecimentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CadastroEstabelecimentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastroEstabelecimentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
