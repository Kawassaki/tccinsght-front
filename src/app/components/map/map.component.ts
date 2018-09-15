import { Component, NgZone, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { QuerySelectorService } from '../../services/query-selector.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { EstabelecimentoService } from '../../services/estabelecimento/estabelecimento.service';
import { DialogLocale } from '../dialogs/dialog-locale/dialogs.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { ModalDetailsComponent } from '../dialogs/modal-details/modal-details.component';

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

  @ViewChild('busca') busca: any;

  @Output() onFilter: EventEmitter<any> = new EventEmitter();

  private markers: any;
  private places: any;
  private latitudeTo: number;
  private longitudeTo: number;
  private zoom: number;
  private mapCenter: any;
  public mapLoaded = false;
  public loading = true;

  public formAnswered = false;

  private directionsService;
  private directionsDisplay;

  public placesInformation = [];

  private markerCurrentLocation = new google.maps.Marker();

  public starList: boolean[] = [true, true, true, true, true];

  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;
  fivethFormGroup: FormGroup;
  sixthFormGroup: FormGroup;
  queryString: string = undefined;

  constructor(
    private zone: NgZone,
    private estabelecimentoService: EstabelecimentoService,
    public dialog: MatDialog,
    public modalDetails : MatDialog,
    private _formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
    window.setInterval(2000);
    this.criaMapa();
    window.setInterval(2000);
    this.loadForm();
  }

  loadForm() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.thirdFormGroup = this._formBuilder.group({
      thirdCtrl: ['', Validators.required]
    });
    this.fourthFormGroup = this._formBuilder.group({
      fourthCtrl: ['', Validators.required]
    });
    this.fivethFormGroup = this._formBuilder.group({
      fivethCtrl: ['', Validators.required]
    });
    this.sixthFormGroup = this._formBuilder.group({
      sixthCtrl: ['', Validators.required]
    });
  }

  buscarEstabelecimentos() {

    var self = this;

    if (self.busca !== undefined && self.busca !== null && self.busca !== "") {
      self.formAnswered = true;
      self.initAutocomplete(self.busca.nativeElement.value);
      self.setLocalizacaoAtual();
      
      window.setTimeout(function() {
        google.maps.event.trigger(self.search.nativeElement, 'focus')
        
      }, 3000);
      window.setTimeout(function() {
        google.maps.event.trigger(self.search.nativeElement, 'keydown', { keyCode: 13 });
      }, 3000);
      self.loading = false;
      
      self.mapLoaded = true;
    }
  }

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


  criaMapa() {
    let mapProp = {
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
  }

  setLocalizacaoAtual() {
    const self = this;
    const options = {
      enableHighAccuracy: false,
      timeout: 500,
      maximumAge: 0
    };

    window.navigator.geolocation.watchPosition(function (data) {

      self.mapCenter = new google.maps.LatLng(data.coords.latitude, data.coords.longitude);

      if (!self.map.getCenter() || (data.coords.latitude !== self.map.getCenter().lat()) || (data.coords.longitude !== self.map.getCenter().lng())) {
        self.map.setCenter(self.mapCenter);
      }

      self.markerCurrentLocation.setAnimation(google.maps.Animation.DROP);
      self.markerCurrentLocation.setPosition(self.mapCenter);
      self.markerCurrentLocation.setMap(self.map);
      self.markerCurrentLocation.setDraggable(true);
      self.markerCurrentLocation.setIcon(self.circleCurrentPosition);

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

    if (self.markers) {
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

  initAutocomplete(queryString) {
    var self = this;

    if (queryString !== undefined && queryString !== null && queryString !== "") {
      self.search.nativeElement.value = queryString;


      let searchBox = new google.maps.places.SearchBox(self.search.nativeElement);

      // $timeout(function() {
      // var input = angular.element("#" + 'id_of_searchBox')[0];

      // }, 100);
      // google.maps.event.trigger(self.search.nativeElement, 'focus')
      // google.maps.event.trigger(self.search.nativeElement, 'keydown', { keyCode: 13 });

      self.map.controls[google.maps.ControlPosition.TOP_LEFT].push(self.search.nativeElement);
      self.map.controls[google.maps.ControlPosition.TOP_LEFT].push(self.rota.nativeElement);

      
      self.map.addListener('bounds_changed', function () {
        searchBox.setBounds(self.map.getBounds());
      });

      // google.maps.event.trigger(searchBox, 'place_changed');

      searchBox.addListener('places_changed', function () {
        self.map.setCenter(self.mapCenter);
        self.places = searchBox.getPlaces();
        if (self.places.length == 0) {
          return;
        }
        self.cleanMarkers();
        self.getDetails();
      });
    }
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

    self.placesInformation = [];

    self.places.forEach(function (placeEach) {
      service.getDetails({
        placeId: placeEach.place_id
      }, function (place, status) {

        if (status === google.maps.places.PlacesServiceStatus.OK) {

          for (var i = 0; i < placeEach.length; i++) {
            timeout = i * 200;
          }
          window.setTimeout(function () {
            let marker = self.addMarkPlace(place);
            google.maps.event.addListener(marker, 'click', function () {
              if (marker.getAnimation() === google.maps.Animation.BOUNCE) {
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

    if (self.directionsDisplay) {
      self.directionsDisplay.setDirections({ routes: [] });
    }

    return marker;
  }
  // getQuerySelector(query){
  //   this.hidden = true;
  //   console.log("map.component.ts", query);
  // }

  gerarRota() {
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
    self.directionsDisplay.setOptions({ suppressMarkers: true });
    self.calculateAndDisplayRoute(self.directionsService, self.directionsDisplay);
  }

  calculateAndDisplayRoute(directionsService, directionsDisplay) {
    var self = this;
    directionsDisplay.setDirections({ routes: [] });

    if (self.latitudeTo && self.longitudeTo && (self.markers && self.markers.length > 1)) {
      directionsService.route({
        origin: { lat: self.markerCurrentLocation.getPosition().lat(), lng: self.markerCurrentLocation.getPosition().lng() },
        destination: { lat: self.latitudeTo, lng: self.longitudeTo },
        travelMode: google.maps.TravelMode.DRIVING
      }, function (response, status) {
        if (status === 'OK') {
          directionsDisplay.setDirections(response);
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      });
    } else if (self.markers && self.markers.length === 1) {
      directionsService.route({
        origin: { lat: self.markerCurrentLocation.getPosition().lat(), lng: self.markerCurrentLocation.getPosition().lng() },
        destination: { lat: self.markers[0].position.lat(), lng: self.markers[0].position.lng() },
        travelMode: google.maps.TravelMode.DRIVING
      }, function (response, status) {
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

  limparRotas(directionsDisplay) {
    directionsDisplay.setMap(null);
  }

  getInformations(place) {
    var self = this;
    // busca dados de cada place retornado pelo google para validar se tem cadastro no sistema ou não
    this.estabelecimentoService.getInfoByPlaceId(place).subscribe(
      estabelecimentoResponse => {
        self.setStar(place);
        
        if(place.website){
          place.isCadastrado = true;
        } else {
          place.isCadastrado = false;
        }

        if(place.isCadastrado){
          self.placesInformation.unshift(place);
        } else {
          self.placesInformation.push(place);
        }

        // NÃO REMOVER ESSE MÉTODO
        // if (estabelecimentoResponse.place_id === place.place_id) {
        //   place.isCadastrado = true;
        //   self.placesInformation.unshift(estabelecimentoResponse);
        //   return;
        // }

        //Buscar os dados no banco para saber se ele tem cadastro ou não e reutilizar o mesmo json acresentando as informações que faltam

        self.zone.run(() => { });
      }
    );
  }

  setStar(place) {
    if (place) {
      place.starList = [];
      for (var i = 0; i <= 4; i++) {
        if (i < Math.floor(place.rating)) {
          place.starList[i] = false;
        }
        else {
          place.starList[i] = true;
        }
      }
    }
  }

  openDialog(): void {
    this.dialog.open(DialogLocale, {
      width: '480px',
    });
  }

  openDetails(place){
    this.modalDetails.open(ModalDetailsComponent, {
      width: '920px',
      height: '520px',
      panelClass: 'custom-dialog-container',
      data: {place : place, mapa : this.map},
      
    });
  }
}


