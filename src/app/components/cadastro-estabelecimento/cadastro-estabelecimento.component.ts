import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { } from '@types/googlemaps';



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
  nome: string = "abc";
  cnpj: any;
  endereco: any;
  telefone: any;
  place_id: any;
  website: any
    
  constructor() { }


  ngOnInit() {
    var self = this;

    let mapProp = {
      center: this.mapCenter,
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    self.mapCenter = new google.maps.LatLng(-34.397, 150.644);

    this.initAutocomplete();

    window.navigator.geolocation.getCurrentPosition(function (data) {
      self.mapCenter = new google.maps.LatLng(data.coords.latitude, data.coords.longitude);
      self.map.setCenter(self.mapCenter);
    });
  }

  initAutocomplete() {
    var self = this;
    let searchBox = new google.maps.places.SearchBox(this.search.nativeElement);
    // this.getZone(searchBox);


    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(this.search.nativeElement);

    this.map.addListener('bounds_changed', function () {
      // console.log(self.places);
      searchBox.setBounds(self.map.getBounds());
    });

    searchBox.addListener('places_changed', function () {
      self.places = searchBox.getPlaces();
      console.log(searchBox);
      if (self.places.length == 0) {
        return;
      }

      // Clear out the old markers.
      self.cleanMarkers();
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
      // console.log(placeEach);
      service.getDetails({
        placeId: placeEach.place_id
      }, function (place, status) {

        if (status === google.maps.places.PlacesServiceStatus.OK) {
          let marker = self.addMarkPlace(place);

          google.maps.event.addListener(marker, 'click', function () {
            self.nome = place.name;
            self.telefone = place.international_phone_number;
            self.place_id = place.place_id;
            self.website = place.website;
            self.endereco = place.vicinity;
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

    // Create a marker for each place.
    self.markers.push(marker);

    if (place.geometry.viewport) {
      // Only geocodes have viewport.
      bounds.union(place.geometry.viewport);
    } else {
      bounds.extend(place.geometry.location);
    }

    this.map.fitBounds(bounds);

    return marker;
  }
}
