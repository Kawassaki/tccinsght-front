import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import { MapComponent } from '../map/map.component';
import { QuerySelectorService } from '../../services/query-selector.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {


  constructor( private _querySelector: QuerySelectorService) { }

  ngOnInit() {
    
  }

 
}
