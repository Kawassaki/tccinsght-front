import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from "@angular/router";

@Component({
  selector: 'app-questionario',
  templateUrl: './questionario.component.html',
  styleUrls: ['./questionario.component.css']
})
export class QuestionarioComponent implements OnInit {


  @Output() onFilter: EventEmitter<any> = new EventEmitter();

  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;
  fivethFormGroup: FormGroup;
  sixthFormGroup: FormGroup;
  queryString: string = undefined;


  constructor(private _formBuilder: FormBuilder, private router: Router,) { }

  ngOnInit() {
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

  buscarEstabelecimentos(){

    var self = this;

    if(self.firstFormGroup.value.firstCtrl !== "" && self.firstFormGroup.value.firstCtrl !== null && self.firstFormGroup.value.firstCtrl !== undefined){
      self.queryString += self.firstFormGroup.value.firstCtrl + " "
    }

    if(self.secondFormGroup.value.secondCtrl !== "" && self.secondFormGroup.value.secondCtrl !== null && self.secondFormGroup.value.secondCtrl !== undefined ){
      self.queryString += self.secondFormGroup.value.secondCtrl + " "
    }

    if(self.thirdFormGroup.value.thirdCtrl !== "" && self.thirdFormGroup.value.thirdCtrl !== null && self.thirdFormGroup.value.thirdCtrl !== undefined){
      self.queryString += self.thirdFormGroup.value.thirdCtrl + " "
    }

    if(self.fourthFormGroup.value.fourthCtrl !== "" && self.fourthFormGroup.value.fourthCtrl !== null && self.fourthFormGroup.value.fourthCtrl !== undefined){
      self.queryString += self.fourthFormGroup.value.fourthCtrl + " "
    }

    if(self.fivethFormGroup.value.fivethCtrl !== "" && self.fivethFormGroup.value.fivethCtrl !== null && self.fivethFormGroup.value.fivethCtrl !== undefined){
      self.queryString += self.fivethFormGroup.value.fivethCtrl + " "
    }

    // console.log(self.queryString.trim());

    self.onFilter.emit(self.queryString.trim());
    // self.queryString = "";


    // self.mapa.
  }

}
