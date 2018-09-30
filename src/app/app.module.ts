import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { UserComponent } from './components/user/user.component';
import { MaterialDesingModule } from './modules/material-desing/material-desing.module';
import { MenuComponent } from './components/menu/menu.component';
import { LoginComponent } from './components/login/login.component';
import { MapComponent } from './components/map/map.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { RoutingModule } from './routing.module';
import { CadastroEstabelecimentoComponent } from './components/cadastro-estabelecimento/cadastro-estabelecimento.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';

import { QuestionarioComponent } from './components/questionario/questionario.component';
import { EstabelecimentoService } from './services/estabelecimento/estabelecimento.service';
import { UsuarioService } from './services/usuario/usuario.service';
import { SnackBarComponent } from './components/snack-bar/snack-bar.component';
import { DialogLocale } from './components/dialogs/dialog-locale/dialogs.component';
import { AuthenticationService } from './services/authentication.service';
import { AvatarModule } from 'ng2-avatar';
import { CadastrarComponent } from './components/cadastrar/cadastrar.component';
import { ModalDetailsComponent }from './components/dialogs/modal-details/modal-details.component';
import { CreditCardDirectivesModule } from 'angular-cc-library';

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    MapComponent,
    MenuComponent,
    LoginComponent,
    MapComponent,
    PageNotFoundComponent,
    CadastroEstabelecimentoComponent,
    HomePageComponent,
    QuestionarioComponent,
    SnackBarComponent,
    DialogLocale,
    CadastrarComponent,
    ModalDetailsComponent,
           
  ],
  imports: [
    BrowserModule,
    MaterialDesingModule,
    RoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpModule,
    AvatarModule.forRoot(),
    CreditCardDirectivesModule
  
  ],
  exports: [
    RouterModule,
    
  ],
  providers: [ 
    EstabelecimentoService, 
    UsuarioService,
    AuthenticationService
  ],
  bootstrap: [AppComponent],
  entryComponents: [DialogLocale, ModalDetailsComponent]
})
export class AppModule { }
