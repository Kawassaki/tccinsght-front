import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';    
import { MenuItem } from 'primeng/api';
import { GrowlModule } from 'primeng/primeng';
import { MessageModule } from 'primeng/primeng';


@NgModule({
  imports: [
    CommonModule,
    AccordionModule,
    GrowlModule,
    MessageModule
  ],
  exports:[
    AccordionModule,
    GrowlModule,
    MessageModule
  ],
  declarations: []
})
export class PrimeNgModule { }
