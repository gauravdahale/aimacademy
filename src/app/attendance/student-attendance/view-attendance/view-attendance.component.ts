import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {StudentAttendance} from "../../../model";
import {MatTableDataSource} from "@angular/material/table";
import {collection, collectionData, Firestore, query, where} from "@angular/fire/firestore";
import {Observable} from "rxjs";
import {AttendanceItem} from "../../../interfaces/Attendance.model";
import {map} from "rxjs/operators";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {DatePipe} from "@angular/common";

@Component({
    selector: 'app-view-attendance',
    templateUrl: './view-attendance.component.html',
    styleUrls: ['./view-attendance.component.scss']
})
export class ViewAttendanceComponent implements OnInit{
    dataSource = new MatTableDataSource<AttendanceItem>()
    attendanceData: any[] = []
    batchSelected = ''
    date = new Date()
    displayedColumns: string[] = ['position', 'studentName', 'action'];


    constructor(
        @Inject(MAT_DIALOG_DATA) public data: StudentAttendance,
        private  readonly mFirestore:Firestore,
        private readonly firestore:AngularFirestore,
        private readonly mDatePipe:DatePipe
    ) {
this.date =new Date(this.data.date)
        this.batchSelected = this.data.className
    }

  ngOnInit(): void {
      this.attendanceData = []
      this.dataSource.data = this.attendanceData

      console.log('checkexisting Attendance Called! ')
      let d = this.mDatePipe.transform(this.date, 'dd-MM-yyyy')

      if (this.batchSelected != '' && this.date != null) {
          this.firestore.doc<any>(`attendance/${this.batchSelected}/attendance/${d}`)
              .valueChanges()

              .subscribe(res => {
                  if (res == null) {
                      let mRef = collection(this.mFirestore, 'students')
                      // @ts-ignore
                      let mQuery = query(mRef, where('batchName', '==', this.batchSelected))
                      let collectionDataquery = collectionData(mQuery) as Observable<AttendanceItem[]>

                      collectionDataquery.pipe(
                          map(x => x.map(y => ({
                              "rollNo": y.rollNo,
                              "studentName": y.studentName,
                              "status": 'Present'
                          })))
                      ).subscribe(res => {
                          this.dataSource = new MatTableDataSource<AttendanceItem>(res)
                          this.attendanceData = res
                          this.dataSource.data = res

                      })
                  } else {
                      // alert(JSON.stringify(res))
                      // console.log(data)
                      this.attendanceData = res['attendance'] as AttendanceItem[]
                      this.dataSource.data = this.attendanceData
                  }
              })
      }
  }



}
