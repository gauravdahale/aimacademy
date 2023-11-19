import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {needConfirmation} from "../../../confirm-dialog/confirm-dialog.decorator";
import {AddClassComponent} from "../../../add-class/add-class.component";
import {EditUsersComponent} from "../../edit-users/edit-users.component";
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss']
})
export class StudentListComponent implements  AfterViewInit{
  _destroyed$ = new Subject()
  displayedColumns: string[] = ['position', 'userName','userNumber','type', 'action'];
  data: any[] = []
    @ViewChild(MatPaginator) paginator!: MatPaginator;

  datasource: MatTableDataSource<any>
  constructor(private marDialog: MatDialog,
              private matSnackBar:MatSnackBar,
              private readonly mFirestore: AngularFirestore) {
    this.datasource = new MatTableDataSource<any>(this.data)
  }
  ngOnInit(): void {
      this.mFirestore.collection('users',ref => ref.where('type','==','Student')).valueChanges({idField: 'id'}).pipe(takeUntil(this._destroyed$))
        .subscribe(res => {
          this.data = res
          this.datasource = new MatTableDataSource<any>(this.data)
            this.datasource.paginator =this.paginator


        })
  }
  ngOnDestroy(): void {
    this._destroyed$.next('')
    this._destroyed$.complete()
  }


  edit(data: any) {
    this.marDialog.open(EditUsersComponent,
        {
          width: '600px',
          data:data
        })

  }

    ngAfterViewInit(): void {
      this.datasource.paginator =this.paginator
    }

}
