import { Component } from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {needConfirmation} from "../../../confirm-dialog/confirm-dialog.decorator";
import {AddClassComponent} from "../../../add-class/add-class.component";

@Component({
  selector: 'app-parent-list',
  templateUrl: './parent-list.component.html',
  styleUrls: ['./parent-list.component.scss']
})
export class ParentListComponent {
  _destroyed$ = new Subject()
  displayedColumns: string[] = ['position', 'userName','userNumber','childName','rollNo','type', 'action'];
  data: any[] = []
  datasource: MatTableDataSource<any>
  constructor(private marDialog: MatDialog,
              private matSnackBar:MatSnackBar,
              private readonly mFirestore: AngularFirestore) {
    this.datasource = new MatTableDataSource<any>(this.data)
  }
  ngOnInit(): void {
    this.mFirestore.collection('users',ref => ref.where('type','==','Parent')).valueChanges({idField: 'id'}).pipe(takeUntil(this._destroyed$))
        .subscribe(res => {
          this.data = res
          this.datasource = new MatTableDataSource<any>(this.data)

        })
  }
  ngOnDestroy(): void {
    this._destroyed$.next('')
    this._destroyed$.complete()
  }

  edit(data: any) {
    this.marDialog.open(AddClassComponent,
        {
          width: '600px',
          data:data
        })

  }
}