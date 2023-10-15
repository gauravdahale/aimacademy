import {Component, Inject} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-edit-users',
  templateUrl: './edit-users.component.html',
  styleUrls: ['./edit-users.component.scss']
})
export class EditUsersComponent {
mData:any

  constructor(
      @Inject(MAT_DIALOG_DATA) public data: any,

  ){
  this.mData = data
  }
}
