import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { } from '@types/googlemaps';
import { QuerySelectorService } from '../../services/query-selector.service';
import { MatSnackBar } from '@angular/material';
import { SelectItem } from 'primeng/components/common/api';
import { MessageModule } from 'primeng/primeng';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit {


  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;

  @ViewChild('search') search: any;

  private markers: any;
  private places: any;
  private latitude: number;
  private longitude: number;
  private zoom: number;
  private mapCenter: any;
  private markerCurrentLocation;
  // msgs: MessageModule[] = [];
  // hidden: boolean= true;
  
  constructor(
    private zone: NgZone,
  ) { }

  ngOnInit() {
    this.criaMapa();
    this.setLocalizacaoAtual();
    this.initAutocomplete();
  }

  criaMapa(){
    let mapProp = {
      zoom: 17,
      mapTypeId: google.maps.MapTypeId.ROADMAP
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
      self.map.setCenter(self.mapCenter);

      let contentString = 'Sua localização';

      let infowindow = new google.maps.InfoWindow({
        content: contentString
      });

      self.markerCurrentLocation = new google.maps.Marker({
        position: self.mapCenter,
        map: self.map,
        draggable: true,
        animation: google.maps.Animation.DROP
      });

      self.markerCurrentLocation.addListener('mouseover', function() {
        infowindow.open(self.map, self.markerCurrentLocation);
        self.toggleBounce(self.markerCurrentLocation)
      });
      self.markerCurrentLocation.addListener('mouseout', function(){
        infowindow.close();
        self.toggleBounce(self.markerCurrentLocation)
      });

      self.markerCurrentLocation.addListener('dragend', function(mark){
        let localationDraggend = new google.maps.LatLng(mark.latLng.lat(), mark.latLng.lng());
        if(self.mapCenter !== localationDraggend){
          self.mapCenter = localationDraggend;
          console.log("Localização Atualizada")
        }
      });
    }, null, options);
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
    let searchBox = new google.maps.places.SearchBox(this.search.nativeElement);

    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(this.search.nativeElement);

    this.map.addListener('bounds_changed', function () {
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
            console.log(self.markers);
          });
        }
      });
    });
  }


  addMarkPlace(place){
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

  // getQuerySelector(query){
  //   this.hidden = true;
  //   console.log("map.component.ts", query);
  // }

  gerarRota(){
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer({
      draggable: true,
      map: this.map
    });

    this.calculateAndDisplayRoute(directionsService, directionsDisplay);
  }

  calculateAndDisplayRoute(directionsService, directionsDisplay) {
    directionsService.route({
      origin: {lat: this.markerCurrentLocation.position.lat(), lng: this.markerCurrentLocation.position.lng()},
      destination: {lat: -25.4226576, lng: -49.27069740000002},
      travelMode: google.maps.TravelMode.DRIVING
    }, function(response, status) {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }
}
