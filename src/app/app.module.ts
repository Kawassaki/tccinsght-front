import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { UserComponent } from './components/user/user.component';
import { MapComponent } from './components/map/map.component';

import { MaterialDesingModule } from './modules/material-desing/material-desing.module';
import { MenuComponent } from './components/menu/menu.component';


@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    MapComponent,
    MenuComponent,

  ],
  imports: [
    BrowserModule,
    MaterialDesingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
