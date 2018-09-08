import { Component, OnInit } from '@angular/core';
import { Router } from '../../../../node_modules/@angular/router';

@Component({
  selector: 'app-cadastrar',
  templateUrl: './cadastrar.component.html',
  styleUrls: ['./cadastrar.component.css']
})
export class CadastrarComponent implements OnInit {
  public isAuth = false;

  constructor( private router: Router) { }

  ngOnInit() {
    if(localStorage.getItem('user') === 'teste@cinq.com.br'){
      this.isAuth = true;
      this.router.navigate(['home']);
    } else {
      this.router.navigate(['cadastro']);
    }
    
  }
}
