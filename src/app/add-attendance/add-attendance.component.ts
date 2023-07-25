import {Component} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {collection, collectionData, Firestore, query, where} from "@angular/fire/firestore";
import {Observable} from "rxjs";
import {MatTableDataSource} from "@angular/material/table";
import {MatDialogRef} from "@angular/material/dialog";
import {AttendanceItem} from "../interfaces/Attendance.model";
import {map} from "rxjs/operators";

@Component({
    selector: 'app-add-attendance',
    templateUrl: './add-attendance.component.html',
    styleUrls: ['./add-attendance.component.css']
})
export class AddAttendanceComponent {
    batches$: Observable<any>
    date = new Date()
    attendanceData: any[] = []
    batchSelected = ''
    displayedColumns: string[] = ['position', 'studentName', 'batchName', 'action'];
    dataSource = new MatTableDataSource<AttendanceItem>()

    constructor(private readonly mFirestore: Firestore,) {
        let batchRef = collection(this.mFirestore, 'class')
        this.batches$ = collectionData(batchRef)
    }

    search() {

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
    }

    Submit() {

    }
}
