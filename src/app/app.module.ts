import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { UserComponent } from './components/user/user.component';
import { MaterialDesingModule } from './modules/material-desing/material-desing.module';
import { MenuComponent } from './components/menu/menu.component';
import { LoginComponent } from './components/login/login.component';
import { MapComponent } from './components/map/map.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { RoutingModule } from './routing.module';



@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    MapComponent,
    MenuComponent,
    LoginComponent,
    MapComponent,
    PageNotFoundComponent,
  ],
  imports: [
    BrowserModule,
    MaterialDesingModule,
    RoutingModule
  ],
  exports: [
    RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
