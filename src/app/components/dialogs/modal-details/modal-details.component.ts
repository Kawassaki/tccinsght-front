import { Component, OnInit, Inject, ViewChild, NgZone } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-modal-details',
  templateUrl: './modal-details.component.html',
  styleUrls: ['./modal-details.component.css']
})
export class ModalDetailsComponent implements OnInit {

  links = ['First', 'Second', 'Third'];
  activeLink = this.links[0];
  background = '#FF6E40';

  @ViewChild('gmap') gmapElement: any;

  constructor(
    public modalRef: MatDialogRef<ModalDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private zone: NgZone,
  ) { }

  onNoClick(): void {
    this.modalRef.close();
  }

  ngOnInit(){
    this.gmapElement = new google.maps.Map(this.gmapElement.nativeElement, this.data.mapa);
    console.log(this.data);
  }
}
