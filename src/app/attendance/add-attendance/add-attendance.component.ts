import {Component} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {arrayUnion, collection, collectionData, doc, Firestore, query, setDoc, where} from "@angular/fire/firestore";
import {Observable} from "rxjs";
import {MatTableDataSource} from "@angular/material/table";
import {AttendanceItem} from "../../interfaces/Attendance.model";
import {map} from "rxjs/operators";
import {DatePipe} from "@angular/common";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatSelectChange} from "@angular/material/select";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
    selector: 'app-add-attendance',
    templateUrl: './add-attendance.component.html',
    styleUrls: ['./add-attendance.component.scss']
})
export class AddAttendanceComponent {
    batches$: Observable<any>
    date = new Date()
    attendanceData: any[] = []
    batchSelected = ''
    displayedColumns: string[] = ['position', 'studentName', 'action'];
    dataSource = new MatTableDataSource<AttendanceItem>()

    constructor(private readonly mFirestore: Firestore,
                private readonly mSnackBar: MatSnackBar,
                private readonly mDialogRef: MatDialogRef<AddAttendanceComponent>,
                private firestore: AngularFirestore,
                private readonly mDatePipe: DatePipe) {
        let batchRef = collection(this.mFirestore, 'class')
        this.batches$ = collectionData(batchRef)
    }

    search() {
        this.checkexistingAttendance()
        // let mRef = collection(this.mFirestore, 'students')
        // // @ts-ignore
        // let mQuery = query(mRef, where('batchName', '==', this.batchSelected))
        // let collectionDataquery = collectionData(mQuery) as Observable<AttendanceItem[]>
        //
        // collectionDataquery.pipe(
        //     map(x => x.map(y => ({
        //         "rollNo": y.rollNo,
        //         "studentName": y.studentName,
        //         "status": 'Present'
        //     })))
        // ).subscribe(res => {
        //     this.dataSource = new MatTableDataSource<AttendanceItem>(res)
        //     this.attendanceData = res
        //     this.dataSource.data = res
        //
        // })
    }

    Submit() {
        if (this.batchSelected != '' && this.attendanceData.length > 0) {
            const batch = this.firestore.firestore.batch()

            let d = this.mDatePipe.transform(this.date, 'dd-MM-yyyy')
            let ref = doc(this.mFirestore, `attendance/${this.batchSelected}/attendance/` + d)
            this.attendanceData.forEach(it => {
                let StudentRef = this.firestore.firestore.doc(`studentAttendance/${it.rollNo}`)
                it.className = this.batchSelected
                it.status = it.checked==true ? 'Present' : 'Absent',
                    batch.set(StudentRef, {'attendance': arrayUnion({...it, ...{date: d}})}, {merge: true})
                // setDoc(StudentRef, {'attendance': arrayUnion({...it,...{date:d}})},)
            })
            batch.commit().then(() => {
                setDoc(ref, {
                    className: this.batchSelected.toString(),
                    date: d,
                    attendance: this.attendanceData,
                    timestamp: new Date()
                }).then(() => {

                    this.mSnackBar.open('Attendance added successfully')._dismissAfter(3000)
                    this.mDialogRef.close()
                })
            })

        } else this.mSnackBar.open('Please select a batch ')._dismissAfter(3000)
    }

    onBatchSelected($event: MatSelectChange) {
        this.attendanceData = []
        this.dataSource.data = this.attendanceData
        this.checkexistingAttendance()
    }

    onDateChange($event: MatDatepickerInputEvent<unknown, unknown | null>) {
        this.checkexistingAttendance()

    }

    private checkexistingAttendance() {
        this.attendanceData = []
        this.dataSource.data = this.attendanceData

        console.log('checkexisting Attendance Called! ')
        let d = this.mDatePipe.transform(this.date, 'dd-MM-yyyy')

        if (this.batchSelected != '' && this.date != null) {
            this.firestore.doc<any>(`attendance/${this.batchSelected}/attendance/${d}`)
                .valueChanges()

                .subscribe(res => {
                    if (res == null) {
                        console.log('NEW ATTENDANCE ')
                        let mRef = collection(this.mFirestore, 'students')
                        // @ts-ignore
                        let mQuery = query(mRef, where('batchName', '==', this.batchSelected))
                        let collectionDataquery = collectionData(mQuery) as Observable<AttendanceItem[]>

                        collectionDataquery.pipe(
                            map(x => x.map(y => ({
                                "rollNo": y.rollNo,
                                "studentName": y.studentName,
                                "status": "Present",
                                "checked": true
                            })))
                        ).subscribe(res => {

                            this.dataSource = new MatTableDataSource<AttendanceItem>(res)
                            this.attendanceData = res
                            this.dataSource.data = res

                        })
                    } else {
                        console.log(' ATTENDANCE FOUND ')
                        console.log(res)

                        // alert(JSON.stringify(res))
                        // console.log(data)
                        this.attendanceData = res['attendance'] as AttendanceItem[]
                        this.attendanceData.forEach(it=>{
                            it.checked = it.status=='Present'
                        })
                        this.dataSource.data = this.attendanceData
                    }
                })
        } else this.mSnackBar.open('Please select a batch first')._dismissAfter(2500)
    }

    getStatus(status: Boolean) {
        return status ? 'P' : 'A'
    }

    isPresent(status: boolean) {
        return status ? 'Present' : 'Absent'
    }
}
