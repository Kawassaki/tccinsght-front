import { Component, NgZone, OnInit, ViewChild, Renderer } from '@angular/core';
// import { } from '@types/googlemaps';

import { Estabelecimento } from '../../models/estabelecimento';
import { EstabelecimentoService } from '../../services/estabelecimento/estabelecimento.service';



@Component({
  selector: 'app-cadastro-estabelecimento',
  templateUrl: './cadastro-estabelecimento.component.html',
  styleUrls: ['./cadastro-estabelecimento.component.css']
})
export class CadastroEstabelecimentoComponent implements OnInit {

  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  @ViewChild('search') search: any;

  private markers: any;
  private places: any;
  private latitude: number;
  private longitude: number;
  private zoom: number;
  private mapCenter: any;
  
  public estabelecimento: Estabelecimento;

  private renderer: Renderer;
  private estabelecimentos:any;
  private estabelecimentosById:any;
  private markerCurrentLocation;
  
  constructor( 
    private zone: NgZone,
    private estabelecimentoService: EstabelecimentoService
  ) {  }



  retornaEstabelecimentoApi(){
    this.estabelecimentoService.getEstabelecimentos().subscribe(estabelecimentoTeste =>{
       this.estabelecimentos = estabelecimentoTeste 
       console.log(this.estabelecimentos);
      }
    );
    
    
    this.estabelecimentoService.getEstabelecimentosById().subscribe(
      estabelecimentoTeste => {
        this.estabelecimentosById = estabelecimentoTeste
        console.log(this.estabelecimentosById);
      }
    );
    
  }

  salvarEstabelecimento(){
    var self = this;
    self.estabelecimentoService.salvarEstabelecimento(self.estabelecimento);
  }
  

  ngOnInit() {
    var self = this;
    self.estabelecimento = new Estabelecimento();

    let mapProp = {
      center: self.mapCenter,
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    self.map = new google.maps.Map(self.gmapElement.nativeElement, mapProp);
    
    self.initAutocomplete();
    var lat;
    var long
    window.navigator.geolocation.getCurrentPosition(function (data) {
      lat = data.coords.latitude;
      long = data.coords.longitude;

      self.mapCenter = new google.maps.LatLng(data.coords.latitude, data.coords.longitude);
      self.map.setCenter(self.mapCenter);
      
      self.markerCurrentLocation = new google.maps.Marker({
        position: self.mapCenter,
        map: self.map,
        draggable: true,
        animation: google.maps.Animation.DROP
      });

      // self.markers.push(marker);
    });
    
  }

  initAutocomplete() {
    var self = this;
    let searchBox = new google.maps.places.SearchBox(this.search.nativeElement);

    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(this.search.nativeElement);

    this.map.addListener('bounds_changed', function () {
      searchBox.setBounds(self.map.getBounds());
    });

    searchBox.addListener('places_changed', function () {
      self.places = searchBox.getPlaces();
      console.log(searchBox);
      if (self.places.length == 0) {
        return;
      }

      self.cleanMarkers();
      self.markers.push(self.markerCurrentLocation);
      self.getDetails();

    });
  }

  cleanMarkers() {
    if (this.markers === undefined || this.markers === null) {
      this.markers = [];
      return;
    }
    this.markers.forEach(function (marker) {
      marker.setMap(null);
    });
    this.markers = [];
  }

  getDetails() {
    var self = this;
    let service = new google.maps.places.PlacesService(this.map);

    self.places.forEach(function (placeEach) {
      service.getDetails({
        placeId: placeEach.place_id
      }, function (place, status) {

        if (status === google.maps.places.PlacesServiceStatus.OK) {
          let marker = self.addMarkPlace(place);
          
          google.maps.event.addListener(marker, 'click', function () {
              console.log(place.icon);
              self.estabelecimento.nome = place.name;
              self.estabelecimento.telefone = place.international_phone_number;
              self.estabelecimento.place_id = place.place_id;
              self.estabelecimento.website = place.website;
              // self.estabelecimento.endereco.rua = place.vicinity;
              self.zone.run(() => {});

          });
        }
      });
    });
  }

  
  addMarkPlace(place): any {
      var self = this;
      let bounds = new google.maps.LatLngBounds();

      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }

      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      let marker = new google.maps.Marker({
        map: self.map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      })

      self.markers.push(marker);

      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }

      this.map.fitBounds(bounds);

      return marker;

  }
}
