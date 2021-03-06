import { Component, NgZone, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { QuerySelectorService } from '../../services/query-selector.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { EstabelecimentoService } from '../../services/estabelecimento/estabelecimento.service';
import { DialogLocale } from '../dialogs/dialog-locale/dialogs.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { ModalDetailsComponent } from '../dialogs/modal-details/modal-details.component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { DialogTermosComponent } from '../dialogs/dialog-termos/dialog-termos.component';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements AfterViewInit {


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
    public termosDialog: MatDialog,
    public modalDetails: MatDialog,
    private _formBuilder: FormBuilder,
    private router: Router,
    private spinnerService: Ng4LoadingSpinnerService
  ) { }

  ngAfterViewInit() {
    this.spinnerService.show();
    window.setInterval(2000);
    this.criaMapa();
    window.setInterval(2000);
    this.loadForm();
    this.spinnerService.hide();
    this.openTermos();
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

      if (self.search.nativeElement !== null) {

        window.setTimeout(function () {
          google.maps.event.trigger(self.search.nativeElement, 'focus')

        }, 1000);
        window.setTimeout(function () {
          google.maps.event.trigger(self.search.nativeElement, 'keydown', { keyCode: 13 });
        }, 1000);
        self.loading = false;
      }

      self.mapLoaded = true;
    }
  }

  private markerCurrentLocationInfo = new google.maps.InfoWindow({
    content: 'Sua localização'
  });

  private circleCurrentPosition = {
    path: './assets/icons/currentLocation.png',
    fillColor: '#FF9E80',
    fillOpacity: 1,
    scale: 3,
    strokeColor: '#FF6E40',
    strokeWeight: 15,
  };

  private placeMarker = {
    icon: './assets/icons/map-marker.png',
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
      self.map.controls[google.maps.ControlPosition.TOP_LEFT].push(self.search.nativeElement);
      self.map.controls[google.maps.ControlPosition.TOP_LEFT].push(self.rota.nativeElement);


      self.map.addListener('bounds_changed', function () {
        searchBox.setBounds(self.map.getBounds());
      });

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
    var placesId = [];
    var placesComparation = [];
    self.placesInformation = [];

    self.places.forEach(function (placeEach) {

      placesId.push(placeEach.place_id);

      service.getDetails({
        placeId: placeEach.place_id
      }, function (place, status) {

        placesComparation.push(place);
        self.setStar(place);

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

    self.getInformations(placesId, placesComparation);
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
      icon: './assets/icons/map-marker.png',
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
    self.map.setZoom(15);
    self.map.setCenter(self.mapCenter);

    if (self.directionsDisplay) {
      self.directionsDisplay.setDirections({ routes: [] });
    }

    return marker;
  }

  gerarRota() {
    var self = this;
    if (self.directionsDisplay != null) {
      self.directionsDisplay.setMap(null);
      self.directionsDisplay = null;
    }

    self.directionsService = new google.maps.DirectionsService;
    self.directionsDisplay = new google.maps.DirectionsRenderer;

    self.directionsDisplay.setMap(self.map);
    self.directionsDisplay.setOptions({ suppressMarkers: true });
    self.calculateAndDisplayRoute(self.directionsService, self.directionsDisplay);
  }

  calculateAndDisplayRoute(directionsService, directionsDisplay) {
    var self = this;
    directionsDisplay.setDirections({ routes: [] });
    // Calcula a Rota com base na origem e no destino passado como parametro (padrão do google)

    if (self.latitudeTo && self.longitudeTo && (self.markers && self.markers.length > 1)) {

      //método route possui as seguintes propriedades: origin, destination, travelMode
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

  getInformations(placesIds, places) {
    var self = this;
    // busca dados de cada place retornado pelo google para validar se tem cadastro no sistema ou não
    this.estabelecimentoService.buscarEstabelecimentoPorPlaceId(placesIds).subscribe(

      estabelecimentoResponse => {
        if (estabelecimentoResponse) {

          estabelecimentoResponse.forEach(function (estabelecimentoResponse) {

            places.forEach(function (estabelecimento) {

              if (estabelecimento) {

                if (estabelecimento.place_id === estabelecimentoResponse.placeId) {
                  estabelecimento.dadosAdicionais = estabelecimentoResponse;
                }
              }
            });
          });
        }
        places.forEach(function (place) {
          if (place) {
            if (place.dadosAdicionais) {
              self.placesInformation.unshift(place);
            } else {
              self.placesInformation.push(place);
            }
          }
        });
      }
    );
    self.zone.run(() => { });
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

  openDetails(place) {
    this.modalDetails.open(ModalDetailsComponent, {
      width: '920px',
      height: '520px',
      panelClass: 'custom-dialog-container',
      data: { place: place, mapa: this.map },

    });
  }

  openTermos() {
    var user = JSON.parse(localStorage.getItem('user'));
    if(user.primeiroAcesso == true){
      this.termosDialog.open(DialogTermosComponent, {
        width: '920px',
        height: '500px'
      });
    } else {
      return false;
    }
  }
}


