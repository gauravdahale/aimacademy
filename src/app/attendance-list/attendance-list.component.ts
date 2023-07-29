import {Component, OnDestroy} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {MatTableDataSource} from "@angular/material/table";
import {Observable, Subject, takeUntil} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {AddAttendanceComponent} from "../add-attendance/add-attendance.component";

@Component({
  selector: 'app-attendance-list',
  templateUrl: './attendance-list.component.html',
  styleUrls: ['./attendance-list.component.scss']
})
export class AttendanceListComponent  implements OnDestroy{
  displayedColumns: string[] = ['position', 'className', 'date', 'present','absent','total'];
  dataSource =new MatTableDataSource<any>()
  data:any
  destroyed$ = new Subject()
  batch$:Observable<any>
  batchSelected: any;
  constructor(private readonly mFirestore:AngularFirestore,
              private  readonly  mDialog:MatDialog,
              private readonly matSnackBar:MatSnackBar) {
this.batch$=this.mFirestore.collection('class').valueChanges()
  }

  search() {
    if(this.batchSelected!=null){
      this.mFirestore.collection('attendance').doc(this.batchSelected).collection('attendance').valueChanges({idField:'id'}).pipe(takeUntil(this.destroyed$))
          .subscribe(res=>{
            this.data = res
            this.dataSource.data =this.data
          })
    }
    else this.matSnackBar.open('Please select a batch first')._dismissAfter(3000)
  }

  ngOnDestroy(): void {
    this.destroyed$.next('')
    this.destroyed$.complete()
  }

  getPresent(attendance: any[]) {
    return attendance.filter( (x:any) =>x.status =='Present').length
  }

  getAbsent(attendance: any) {
    return attendance.filter((x:any)=>x.status =='Absent').length

  }

  getTotal(attendance: any) {
    return attendance.length

  }

  AddAttendance() {
    this.mDialog.open(AddAttendanceComponent,{
width:'80%',
      height:'80%'
    })
  }
}
