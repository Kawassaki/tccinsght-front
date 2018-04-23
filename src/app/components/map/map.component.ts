import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { } from '@types/googlemaps';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
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
  // private ngZone: NgZone;

  title = 'app';


  constructor(private ngZone: NgZone) { }

  setMapType(mapTypeId: string) {
    this.map.setMapTypeId(mapTypeId)
  }

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

  ngAfterViewInit() { }

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

  getZone(searchBox) {
    var self = this;
    this.ngZone.run(() => {
      //get the place result
      searchBox.getPlaces().forEach(function (eachPlace) {
        let place: google.maps.places.PlaceResult = this.eachPlace.getPlace();
        //verify result
        if (place.geometry === undefined || place.geometry === null) {
          return;
        }

        //set latitude, longitude and zoom
        this.latitude = place.geometry.location.lat();
        this.longitude = place.geometry.location.lng();
        this.zoom = 12;
      });
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
            console.log(place);
            if("photos" in place){
              place.photos.forEach(function (photoPlace){
                console.log(photoPlace.getUrl({'maxWidth': 1200, 'maxHeight': 600}));
                // photoPlace.getUrl;
                console.log('https://maps.googleapis.com/maps/api/place/photo?photoreference=' + placeEach.reference + '&key=AIzaSyCAGv3exRld0pzJZv-nORwsYFP09tp1p9Q' );
              });
            }
            // infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
            //   'Place ID: ' + place.place_id + '<br>' +
            //   place.formatted_address + '</div>');
            // infowindow.open(map, this);
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