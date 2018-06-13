import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { } from '@types/googlemaps';
import { QuerySelectorService } from '../../services/query-selector.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { EstabelecimentoService } from '../../services/estabelecimento/estabelecimento.service';
import { DialogLocale } from '../dialogs/dialog-locale/dialogs.component';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit {


  @ViewChild('gmap') gmapElement: any;
  
  private map: google.maps.Map;

  @ViewChild('search') search: any;

  @ViewChild('rota') rota: any;

  private markers: any;
  private places: any;
  private latitudeTo: number;
  private longitudeTo: number;
  private zoom: number;
  private mapCenter: any;
  
  private directionsService;
  private directionsDisplay;

  private placesInformation = [];

  private markerCurrentLocation = new google.maps.Marker();


  
  private markerCurrentLocationInfo = new google.maps.InfoWindow({
    content: 'Sua localização'
  });

  private circleCurrentPosition = {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: '#FF9E80',
    fillOpacity: 1,
    scale: 3,
    strokeColor: '#FF6E40',
    strokeWeight: 15,
  };

  private placeMarker = {
    url: 'https://storage.googleapis.com/tcc-api-insight.appspot.com/map-marker.png',
    size: new google.maps.Size(90, 90),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(17, 34),
    scaledSize: new google.maps.Size(50, 50)
  };


  constructor(
    private zone: NgZone,
    private estabelecimentoService : EstabelecimentoService,
    public dialog : MatDialog
  ) { }

  ngOnInit() {
    this.criaMapa();
    this.initAutocomplete();
    this.setLocalizacaoAtual();
  }

  criaMapa(){
    let mapProp = {
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
  }

  setLocalizacaoAtual(){
    const self = this;
    const options = {
      enableHighAccuracy: false,
      timeout: 500,
      maximumAge: 0
    };
    
    window.navigator.geolocation.watchPosition(function (data) {

      self.mapCenter = new google.maps.LatLng(data.coords.latitude, data.coords.longitude);
       
      if(!self.map.getCenter() || (data.coords.latitude !== self.map.getCenter().lat()) || (data.coords.longitude !== self.map.getCenter().lng())){
        self.map.setCenter(self.mapCenter);
      }

      self.markerCurrentLocation.setAnimation(google.maps.Animation.DROP);
      self.markerCurrentLocation.setPosition(self.mapCenter);
      self.markerCurrentLocation.setMap(self.map);
      self.markerCurrentLocation.setDraggable(true);
      self.markerCurrentLocation.setIcon(self.circleCurrentPosition);

      self.markerCurrentLocation.addListener('mouseover', function() {
        self.markerCurrentLocationInfo.open(self.map, self.markerCurrentLocation);
      });

      self.markerCurrentLocation.addListener('mouseout', function(){
        self.markerCurrentLocationInfo.close();
      });

      self.markerCurrentLocation.addListener('dragend', function(mark){
        let localationDraggend = new google.maps.LatLng(mark.latLng.lat(), mark.latLng.lng());
        if(self.mapCenter !== localationDraggend){
          self.mapCenter = localationDraggend;
          self.map.setCenter(self.mapCenter);
          console.log("Localização Atualizada")
        }
      });
    }, null, options);

    if(self.markers){
      self.markers.push(self.markerCurrentLocation);
    }

  }
 
  toggleBounce(marker) {
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
    }
  }

  initAutocomplete() {
    var self = this;
    let searchBox = new google.maps.places.SearchBox(self.search.nativeElement);
    
    self.map.controls[google.maps.ControlPosition.TOP_LEFT].push(self.search.nativeElement);
    self.map.controls[google.maps.ControlPosition.TOP_LEFT].push(self.rota.nativeElement);
    

    self.map.addListener('bounds_changed', function () {
      searchBox.setBounds(self.map.getBounds());
    });
    
    searchBox.addListener('places_changed', function () {
      self.map.setCenter(self.mapCenter);
      self.places = searchBox.getPlaces();
      console.log(searchBox);
      if (self.places.length == 0) {
        return;
      }
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
    let timeout;

    self.places.forEach(function (placeEach) {
      service.getDetails({
        placeId: placeEach.place_id
      }, function (place, status) {

        if (status === google.maps.places.PlacesServiceStatus.OK) {

          for (var i = 0; i < placeEach.length; i++) {
            timeout = i * 200;
          }
          window.setTimeout(function() {
            let marker = self.addMarkPlace(place);
            google.maps.event.addListener(marker, 'click', function () {
              if(marker.getAnimation() === google.maps.Animation.BOUNCE){
                marker.setAnimation(null);
                self.latitudeTo = null;
                self.longitudeTo = null;
              } 
              marker.setAnimation(google.maps.Animation.BOUNCE);
              self.latitudeTo = place.geometry.location.lat();
              self.longitudeTo = place.geometry.location.lng();
              
            });
          }, timeout);

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

    let marker = new google.maps.Marker({
      map: self.map,
      icon: self.placeMarker,
      title: place.name,
      position: place.geometry.location,
      animation: google.maps.Animation.DROP
    })

    self.markers.push(marker);

    if (place.geometry.viewport) {
      bounds.union(place.geometry.viewport);
    } else {
      bounds.extend(place.geometry.location);
    }

    self.map.fitBounds(bounds);
    self.map.setZoom(13);
    self.map.setCenter(self.mapCenter);

    self.getInformations(place);

    if(self.directionsDisplay){
      self.directionsDisplay.setDirections({routes: []});
    }

    return marker;
}
  // getQuerySelector(query){
  //   this.hidden = true;
  //   console.log("map.component.ts", query);
  // }

  gerarRota(){
    var self = this;
    if (self.directionsDisplay != null) {
      self.directionsDisplay.setMap(null);
      self.directionsDisplay = null;
    }

    self.directionsService = new google.maps.DirectionsService;
    self.directionsDisplay = new google.maps.DirectionsRenderer;
    // polylineOptions: {
    //   strokeColor: "red"
    // }, suppressMarkers: true

    self.directionsDisplay.setMap(self.map);
    self.directionsDisplay.setOptions( { suppressMarkers: true } );
    self.calculateAndDisplayRoute(self.directionsService, self.directionsDisplay);
  }

  calculateAndDisplayRoute(directionsService, directionsDisplay) {
    var self = this;
    directionsDisplay.setDirections({routes: []});

    if(self.latitudeTo && self.longitudeTo && (self.markers && self.markers.length > 1)){
      directionsService.route({
        origin: {lat: self.markerCurrentLocation.getPosition().lat(), lng: self.markerCurrentLocation.getPosition().lng()},
        destination: {lat: self.latitudeTo, lng: self.longitudeTo},
        travelMode: google.maps.TravelMode.DRIVING
      }, function(response, status) {
        if (status === 'OK') {
          directionsDisplay.setDirections(response);
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      });
    } else if(self.markers && self.markers.length === 1) {
      directionsService.route({
        origin: {lat: self.markerCurrentLocation.getPosition().lat(), lng: self.markerCurrentLocation.getPosition().lng()},
        destination: {lat: self.markers[0].position.lat(), lng: self.markers[0].position.lng()},
        travelMode: google.maps.TravelMode.DRIVING
      }, function(response, status) {
        if (status === 'OK') {
          directionsDisplay.setDirections(response);
        } else {
          window.alert('Directions request failed due to 2' + status);
        }
      });
    } else {
      self.openDialog();
    }
  }

  limparRotas(directionsDisplay){
    directionsDisplay.setMap(null);
  }

  getInformations(place){
    var self = this;
    // let placeService;
    this.estabelecimentoService.getInfoByPlaceId(place).subscribe(
      estabelecimentoResponse => {
        if(estabelecimentoResponse.place_id === place.place_id){
          self.placesInformation.unshift(estabelecimentoResponse);
          return;
        }
        self.placesInformation.push(place);
      }
    );

    
    // if(placeService){
    //   self.placesInformation.push(placeService);
    //   return;
    // }
  }

  openDialog(): void {
    this.dialog.open(DialogLocale, {
      width: '480px',
    });
  }
}


