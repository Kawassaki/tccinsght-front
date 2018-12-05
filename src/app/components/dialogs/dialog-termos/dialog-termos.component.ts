import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dialog-termos',
  templateUrl: './dialog-termos.component.html',
  styleUrls: ['./dialog-termos.component.css']
})
export class DialogTermosComponent implements OnInit {

  public checked: boolean = false;
  
  constructor() { }

  aceito(){
    var user = JSON.parse(localStorage.getItem('user'));
    localStorage.removeItem('user');
    
    if(this.checked){
      user.primeiroAcesso = false;
    } else {
      user.primeiroAcesso = true;
    }

    localStorage.setItem('user', JSON.stringify(user));
  }

  ngOnInit() {
  }

}
