import { Component, NgZone, OnInit, ViewChild, Renderer } from '@angular/core';
import { CreditCardValidator } from 'angular-cc-library';

import { Estabelecimento } from '../../models/estabelecimento';
import { EstabelecimentoService } from '../../services/estabelecimento/estabelecimento.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '../../../../node_modules/@angular/forms';
import { Usuario } from '../../models/usuario';
import { Detalhes } from '../../models/detalhes';
import { Pagamento } from '../../models/pagamento';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { MatSnackBar } from '@angular/material';



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
  public loading = false;
  public cpfTitular : string;
  public nomeTitular : string;
  

  public estabelecimento = new Estabelecimento();
  public pagamento =  new Pagamento();
  
  private renderer: Renderer;
  private estabelecimentos: any;
  private estabelecimentosById: any;
  
  private usuario = new Usuario();
  
  private markerCurrentLocation = new google.maps.Marker();
  private markerCurrentLocationInfo = new google.maps.InfoWindow({
    content: 'Sua localização'
  });
  
  
  constructor(
    private zone: NgZone,
    private estabelecimentoService: EstabelecimentoService,
    private _fb: FormBuilder,
    public snackBar: MatSnackBar,
    private spinnerService: Ng4LoadingSpinnerService
  ) {
  }

  ngOnInit() {
    var self = this;
    self.spinnerService.show();
    self.validaFormPagament();

    self.usuario = JSON.parse(localStorage.getItem('user'));
    self.estabelecimento = self.buscaEstabelecimentoPorUsuario(self.usuario.id);
  }

  carregaMapa(){
    
    var self = this;

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
  
  salvarEstabelecimento() {
    var self = this;
    self.spinnerService.show();

    self.estabelecimento.usuario = self.usuario;
    self.estabelecimento.pagamento = self.pagamento;

    
    if(self.formPayment.valid){
      self.estabelecimento.pagamento.numeroCartao = self.formPayment.controls.numeroCartao.value;
      self.estabelecimento.pagamento.dataVencimento = new Date(('01/' + self.formPayment.controls.vencimento.value.replace(' ', ''))).toISOString();
      self.estabelecimento.pagamento.codigoVerificador = self.formPayment.controls.codigoVerificador.value;
      self.estabelecimento.pagamento.email = self.email.value;
      self.estabelecimento.pagamento.cpfTitular = self.cpfTitular;
      self.estabelecimento.pagamento.nomeTitular = self.nomeTitular;
    }
    self.estabelecimento.email = self.email.value;

    self.estabelecimentoService.salvarEstabelecimento(self.estabelecimento).subscribe(
      estabelecimento => {
        
        if(estabelecimento !== null){
            var estabelecimentoMessage: string = "Estabelecimento Salvo com Sucesso! :)";
            var action: string = '';
            self.spinnerService.hide();
            self.snackBar.open(estabelecimentoMessage, action, {
              duration: 10000,
              panelClass: ['success-snackbar']
            });
        } else {
          var estabelecimentoMessage: string = "Dados do estabelecimento inconsistentes, verifique os campos e tente novamente";
          var action: string = '';
          self.spinnerService.hide();
          self.snackBar.open(estabelecimentoMessage, action, {
            duration: 10000,
            panelClass: ['success-snackbar']
          });
        }
      }
    );
  }

  validaFormPagament() {
    var self = this;
    self.formPayment = self._fb.group({
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
          self.estabelecimento.contato = place.international_phone_number;
          self.estabelecimento.placeId = place.place_id;
          self.estabelecimento.website = place.website;
          self.estabelecimento.endereco = place.formatted_address;
          self.estabelecimento.email = self.email.value;
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

    if (place.geometry.viewport) {
      bounds.union(place.geometry.viewport);
    } else {
      bounds.extend(place.geometry.location);
    }

    this.map.fitBounds(bounds);

    return self.markerCurrentLocation;

  }

  addDetail() {
    var self = this;
    var newDetail = new Detalhes();
    newDetail.titulo = '';
    newDetail.descricao = '';
    self.estabelecimento.detalhes.unshift(newDetail);
  }

  removeDetail(detail) {
    this.estabelecimento.detalhes.splice(detail, 1);
  }

  getErrorMessage() {
    return this.email.hasError('email') ? 'E-mail inválido' : '';
  }

  buscaEstabelecimentoPorUsuario(idUsuario){
    var self = this;

    var estabelecimento = new Estabelecimento();
    estabelecimento.detalhes = [];
    var pagamento = new Pagamento();
    
    this.estabelecimentoService.buscarEstabelecimentoPorUsuario(idUsuario).subscribe(
      estabelecimentoResponse =>{
        if(estabelecimentoResponse !== null && estabelecimentoResponse !== undefined){
          console.log(estabelecimentoResponse);
          
          estabelecimento.id = estabelecimentoResponse.id;
          estabelecimento.contato = estabelecimentoResponse.contato;
          estabelecimento.email = estabelecimentoResponse.email;
          estabelecimento.nome = estabelecimentoResponse.nome;
          estabelecimento.placeId = estabelecimentoResponse.placeId;
          estabelecimento.website = estabelecimentoResponse.website;
          estabelecimento.email = estabelecimentoResponse.pagamento.email;
          estabelecimento.endereco = estabelecimentoResponse.endereco;

          pagamento.codigoVerificador = estabelecimentoResponse.pagamento.codigoVerificador;
          pagamento.cpfTitular = estabelecimentoResponse.pagamento.cpfTitular;
          pagamento.dataVencimento = new Date(estabelecimentoResponse.pagamento.dataVencimento).toISOString();
          self.email.setValue(estabelecimentoResponse.pagamento.email);
          pagamento.email = estabelecimentoResponse.pagamento.email;
          pagamento.numeroCartao = estabelecimentoResponse.pagamento.numeroCartao;
          pagamento.id = estabelecimentoResponse.pagamento.id;
          pagamento.nomeTitular = estabelecimentoResponse.pagamento.nomeTitular;
          pagamento.cpfTitular = estabelecimentoResponse.pagamento.cpfTitular;
          self.nomeTitular = estabelecimentoResponse.pagamento.nomeTitular;
          self.cpfTitular = estabelecimentoResponse.pagamento.cpfTitular

          self.formPayment.controls.numeroCartao.setValue(pagamento.numeroCartao);
          self.formPayment.controls.codigoVerificador.setValue(pagamento.codigoVerificador);
          var mes = new Date(pagamento.dataVencimento).getUTCMonth();
          var ano = new Date(pagamento.dataVencimento).getUTCFullYear();
          
          self.formPayment.controls.vencimento.setValue((mes + 1) + ' / ' + ano);

          estabelecimento.pagamento = pagamento;

          estabelecimentoResponse.detalhes.forEach(detalheResponse => {
            var detalhes = new Detalhes();
            detalhes.id = detalheResponse.id;
            detalhes.titulo = detalheResponse.titulo;
            detalhes.descricao = detalheResponse.descricao;
            estabelecimento.detalhes.unshift(detalhes);
          });
          
          if(estabelecimento.detalhes.length === 0){
            self.addDetail();
          }
          self.loading = false;
          
          if(!self.loading){
            self.spinnerService.hide();
          }

        } else {
          self.loading = true;
          self.carregaMapa();
        }
      }
    );
    return estabelecimento;
  }

}
