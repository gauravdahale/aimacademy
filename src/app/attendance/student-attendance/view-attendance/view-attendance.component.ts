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
import {MatSnackBar} from "@angular/material/snack-bar";
import * as jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import 'jspdf-autotable'
@Component({
    selector: 'app-view-attendance',
    templateUrl: './view-attendance.component.html',
    styleUrls: ['./view-attendance.component.scss']
})
export class ViewAttendanceComponent implements OnInit {
    dataSource = new MatTableDataSource<AttendanceItem>()
    attendanceData: any[] = []
    batchSelected = ''
    date :any
    displayedColumns: string[] = ['position', 'studentName', 'action'];


    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private readonly mFirestore: Firestore,
        private readonly firestore: AngularFirestore,
        private readonly mSnackbar:MatSnackBar,
        private readonly mDatePipe: DatePipe
    ) {
       this.mSnackbar.open(this.data.date)._dismissAfter(3000)
        this.date = this.data.date
        this.batchSelected = this.data.className
        this.attendanceData= this.data.attendance
        // alert(JSON.stringify(data))
    }

    ngOnInit(): void {
        this.attendanceData = []

        this.dataSource.data = this.attendanceData

        console.log('checkexisting Attendance Called! ')
        // let d = this.mDatePipe.transform(this.date, 'dd-MM-yyyy')

        // if (this.batchSelected != '' && this.date != null) {
        //     this.firestore.doc<any>(`attendance/${this.batchSelected}/attendance/${d}`)
        //         .valueChanges()
        //
        //         .subscribe(res => {
        //             if (res == null) {
        //                 let mRef = collection(this.mFirestore, 'students')
        //                 // @ts-ignore
        //                 let mQuery = query(mRef, where('batchName', '==', this.batchSelected))
        //                 let collectionDataquery = collectionData(mQuery) as Observable<AttendanceItem[]>
        //
        //                 collectionDataquery.pipe(
        //                     map(x => x.map(y => ({
        //                         "rollNo": y.rollNo,
        //                         "studentName": y.studentName,
        //                         "status": 'Present'
        //                     })))
        //                 ).subscribe(res => {
        //                     this.dataSource = new MatTableDataSource<AttendanceItem>(res)
        //                     this.attendanceData = res
        //                     this.dataSource.data = res
        //
        //                 })
        //             } else {
        //                 // alert(JSON.stringify(res))
        //                 // console.log(data)
                        this.attendanceData = this.data.attendance as AttendanceItem[]
                        this.dataSource.data = this.attendanceData
        //             }
        //         })
        // }
    }

    printPDF() {
// Sort the student array by 'correct' field in descending order
//         const sortedStudents = element.students.sort((a, b) => +b.correct - +a.correct);
//         sortedStudents.forEach((student, index) => {
//             student.rank = index + 1; // Adding 1 to make the rank start from 1
//         });
        const doc = new jsPDF.default();  // Use '.default' for jsPDF typings
        const centerX = doc.internal.pageSize.width / 2;
        const rightX = doc.internal.pageSize.width - 20;

        // Add test name and date on top
        doc.setFontSize(12);
        // doc.text( element.testName, 20, 10);
        doc.text('AIM COACHING CLASSES', centerX, 10, { align: 'center' });
        doc.text('Date: ' + this.data.date,  rightX, 10, { align: 'right' });

        const students = this.attendanceData as StudentAttendance[]
        const header = [['Roll No', 'Name', 'Status']];
        const rows = students.map(student => [student.rollNo, student.studentName,student.status]);

        (doc as any).autoTable({
            head: header,
            body: rows,
            startY: 15,
            styles: {
                //
                //     // cellPadding: 4,
                //     fontSize: 10, // Adjust the font size for the table content
                //     cellPadding: { top: 2, right: 2, bottom: 2, left: 2 } ,// Adjust the cell padding for content spacing
                //     minCellHeight: 20,
                //     valign: 'middle'
                // }
                fontSize: 10, // Adjust the font size for the table content
                cellPadding: {top: 2, right: 2, bottom: 2, left: 2}, // Adjust the cell padding for content spacing
                valign: 'middle', // Align cell content vertically to the middle
                halign: 'center', // Align cell content horizontally to the center
                // fillColor: '#ccd0d3', // Set background color for alternating rows
                // textColor: '#333', // Set text color
                lineWidth: 0.1, // Set border line width
                lineColor: '#ccc',
            }// Set border line color
        });
        doc.save(`Attendance-${this.data.date}.pdf`);

    }
}
