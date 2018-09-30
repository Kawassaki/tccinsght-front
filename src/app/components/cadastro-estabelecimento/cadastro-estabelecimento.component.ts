import { Component, NgZone, OnInit, ViewChild, Renderer } from '@angular/core';
import { CreditCardValidator } from 'angular-cc-library';

import { Estabelecimento } from '../../models/estabelecimento';
import { EstabelecimentoService } from '../../services/estabelecimento/estabelecimento.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '../../../../node_modules/@angular/forms';



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
  public numeroCartao: any;
  public vencimento: any;
  public codigoVerificador: any;
  public formPayment: FormGroup;
  public email = new FormControl('', [Validators.required, Validators.email]);
  public expanded = false;

  public estabelecimento: Estabelecimento;

  private renderer: Renderer;
  private estabelecimentos: any;
  private estabelecimentosById: any;

  private markerCurrentLocation = new google.maps.Marker();
  private markerCurrentLocationInfo = new google.maps.InfoWindow({
    content: 'Sua localização'
  });

  private newPlaceObject = {
    estabelecimento: null,
    placeDetails: null,
    pagamento: null

  };
  public listDetails = [];

  constructor(
    private zone: NgZone,
    private estabelecimentoService: EstabelecimentoService,
    private _fb: FormBuilder
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

    self.newPlaceObject.estabelecimento = self.estabelecimento;
    // criar uma string no java para armazenar esses dados,
    // e concatenar com algum caracter especial like '|' para depois na hora de recuperar dar um splt('|') 
    // easy
    self.newPlaceObject.placeDetails = self.listDetails;
    self.newPlaceObject.pagamento = "Montar Objeto de Pagamento para enviar pro banco de dados";

    // self.estabelecimentoService.salvarEstabelecimento(self.newPlaceObject);
    console.log(self.newPlaceObject);
  }



  ngOnInit() {
    var self = this;
    self.validaFormPagament();

    self.estabelecimento = new Estabelecimento();
    var newDetail = { 'titulo': '', 'descricao': '' };
    self.listDetails.unshift(newDetail);

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

  validaFormPagament() {
    this.formPayment = this._fb.group({
      numeroCartao: ['', [<any>CreditCardValidator.validateCCNumber]],
      vencimento: ['', [<any>CreditCardValidator.validateExpDate]],
      codigoVerificador: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(4)]]
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
      if (self.places.length == 0) {
        return;
      }
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

          self.estabelecimento.nome = place.name;
          self.estabelecimento.telefone = place.international_phone_number;
          self.estabelecimento.place_id = place.place_id;
          self.estabelecimento.website = place.website;
          self.estabelecimento.endereco = place.formatted_address;
          self.estabelecimento.proprietario = localStorage.getItem('user'); //pega o usuário salvo na sessão e seta como proprietário
          var informacoes = [];
          
          self.zone.run(() => { });


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

  addDetail() {
    var self = this;
    var newDetail = { 'titulo': '', 'descricao': '' };
    self.listDetails.unshift(newDetail);
  }

  removeDetail(detail) {
    this.listDetails.splice(detail, 1);
  }

  getErrorMessage() {
    return this.email.hasError('required') ? 'Digite seu E-mail' :
      this.email.hasError('email') ? 'E-mail inválido' :
        '';
  }

}
