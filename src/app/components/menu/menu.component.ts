import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  public isAuth = false;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    if(localStorage.getItem('user') !== null){
      this.isAuth = true;
    } else {
      this.isAuth = false;
      location.reload();

    }
  }
  sair(){
    localStorage.setItem('user', null);
    location.reload();
  }

  goToCadastroEstabelecimento(){
    this.router.navigate(['cadastroEstabelecimento']);
    location.reload();
  }

  goToUser(){
    this.router.navigate(['user']);
    // location.reload();
  }

  goToMapa(){
    this.router.navigate(['busca']);
    location.reload();
  }
}
