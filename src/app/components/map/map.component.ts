import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuComponent } from './../menu/menu.component';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  constructor() { }

  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;

  title = 'app';

  setMapType(mapTypeId: string) {
    this.map.setMapTypeId(mapTypeId)    
  }

  ngOnInit() {

    var mapProp = {
      center: new google.maps.LatLng(18.5793, 73.8143),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    
  }
}
