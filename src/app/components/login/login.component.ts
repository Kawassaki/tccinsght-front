import { Component, OnInit, NgZone } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Router, ActivatedRoute } from "@angular/router";
import { DialogLocale } from '../dialogs/dialog-locale/dialogs.component';
import { MatDialog } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public email = new FormControl('', [Validators.required, Validators.email]);
  public hide = true;
  private returnUrl: string;
  public isAuth = false;
  public loginValid = false;

  public user = new Usuario();

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog : MatDialog,
    private zone: NgZone,
  ) { }

  ngOnInit() {
    if(localStorage.getItem('user') === 'teste@cinq.com.br'){
      this.isAuth = true;
      // this.router.navigate(['map']);
    } else {
      this.router.navigate(['login']);
    }
    
    this.returnUrl = this.route.snapshot.queryParams['login'] || '/login';
  }

  logar(){
    let self = this;
    if(self.email && self.email.valid){
      self.user.email = self.email.value;
    }
    if(self.authService.login(self.user)){
      localStorage.setItem('user', self.user.email);
      console.log(localStorage);
      self.isAuth = true;
      this.router.navigate(['home']);
    } else {
      self.openDialog();
    }
  }

  openDialog(): void {
    this.dialog.open(DialogLocale, {
      width: '480px',
    });
  }
  
  getErrorMessage() {
    return this.email.hasError('required') ? 'Digite seu e-mail' : this.email.hasError('email') ? 'Formato do e-mail é inválido' : '';
  }
}
