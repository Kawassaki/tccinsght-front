import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { DialogFaqComponent } from '../dialogs/dialog-faq/dialog-faq.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  public isAuth = false;

  constructor(
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    if(localStorage.getItem('user') !== null){
      this.isAuth = true;
    } else {
      this.isAuth = false;
      location.reload();

    }
  }

  abrirFaq(): void {
    this.dialog.open(DialogFaqComponent, {
      width: '920px',
      height: '500px',
      panelClass: 'custom-dialog-container'
    });
  }

  sair(){
    localStorage.removeItem('user');
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
