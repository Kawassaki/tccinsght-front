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
  public mapLoaded = false;

  public estabelecimento: Estabelecimento;

  private renderer: Renderer;
  private estabelecimentos: any;
  private estabelecimentosById: any;

  private markerCurrentLocation = new google.maps.Marker();
  private markerCurrentLocationInfo = new google.maps.InfoWindow({
    content: 'Sua localização'
  });


  constructor(
    private zone: NgZone,
    private estabelecimentoService: EstabelecimentoService
  ) { }



  retornaEstabelecimentoApi() {
    this.estabelecimentoService.getEstabelecimentos().subscribe(estabelecimentoTeste => {
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

  salvarEstabelecimento() {
    var self = this;
    self.estabelecimentoService.salvarEstabelecimento(self.estabelecimento);
  }


  ngOnInit() {
    var self = this;
    self.estabelecimento = new Estabelecimento();

    let mapProp = {
      center: self.mapCenter,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true // remove controladores default

    };

    self.map = new google.maps.Map(self.gmapElement.nativeElement, mapProp);

    
    self.mapLoaded = true;

    self.initAutocomplete();
    
    const options = {
      enableHighAccuracy: false,
      timeout: 500,
      maximumAge: 0
    };

    window.navigator.geolocation.getCurrentPosition(function (data) {

      if (!self.map.getCenter() || (data.coords.latitude !== self.map.getCenter().lat()) || (data.coords.longitude !== self.map.getCenter().lng())) {
        self.mapCenter = new google.maps.LatLng(data.coords.latitude, data.coords.longitude);
        self.map.setCenter(self.mapCenter);
      }

      self.markerCurrentLocation.setAnimation(google.maps.Animation.DROP);
      self.markerCurrentLocation.setPosition(self.mapCenter);
      self.markerCurrentLocation.setMap(self.map);
      self.markerCurrentLocation.setDraggable(true);
      self.markerCurrentLocation.setIcon('./assets/icons/currentLocation.png');

      self.markerCurrentLocation.addListener('mouseover', function () {
        self.markerCurrentLocationInfo.open(self.map, self.markerCurrentLocation);
      });

      self.markerCurrentLocation.addListener('mouseout', function () {
        self.markerCurrentLocationInfo.close();
      });

      self.markerCurrentLocation.addListener('dragend', function (mark) {
        let localationDraggend = new google.maps.LatLng(mark.latLng.lat(), mark.latLng.lng());
        if (self.mapCenter !== localationDraggend) {
          self.mapCenter = localationDraggend;
          self.map.setCenter(self.mapCenter);
          console.log("Localização Atualizada")
        }
      });
    }, null, options);
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

      // self.cleanMarkers();
      // self.markers.push(self.markerCurrentLocation);
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
            console.log(place);
            self.estabelecimento.nome = place.name;
            self.estabelecimento.telefone = place.international_phone_number;
            self.estabelecimento.place_id = place.place_id;
            self.estabelecimento.website = place.website;
            self.estabelecimento.endereco = place.formatted_address;
            self.estabelecimento.proprietario = localStorage.getItem('user'); //pega o usuário salvo na sessão e seta como proprietário
            var informacoes = [];
            
            self.zone.run(() => { });

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

    self.markerCurrentLocation.setPosition(place.geometry.location);
    // self.markers[0].setPosition(place.geometry.location);

    if (place.geometry.viewport) {
      bounds.union(place.geometry.viewport);
    } else {
      bounds.extend(place.geometry.location);
    }

    this.map.fitBounds(bounds);
    // console.log(self.markers);
    
    return self.markerCurrentLocation;

  }
}
