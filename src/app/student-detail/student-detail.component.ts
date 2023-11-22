import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Route, Router} from "@angular/router";
import {Subject} from "rxjs";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {map} from "rxjs/operators";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {Timestamp} from '@angular/fire/firestore';
import {StudentAttendance} from "../model";
import * as jsPDF from "jspdf";
import 'jspdf-autotable'
import {DatePipe} from "@angular/common";
import {MatSnackBar} from "@angular/material/snack-bar";

export interface AttendanceHistory {
    date: Timestamp,
    rank: number,
    result: string,
    rightAnswers: string,
    testId: string,
    testName: string,
    totalMarks: string,
    name: string,
    rollNo: string,
    wrongAnswers: string
}

@Component({
    selector: 'app-student-detail',
    templateUrl: './student-detail.component.html',
    styleUrls: ['./student-detail.component.scss']
})
export class StudentDetailComponent implements OnInit, OnDestroy {
    mUid!: string
    _destroy$ = new Subject()
    displayedColumns: string[] = ['position', 'testName', 'date', 'rank', 'rightAnswers', 'wrongAnswers', 'result', 'totalMarks'];
    dataSource: MatTableDataSource<AttendanceHistory>
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    mStudent: any

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private datePipe: DatePipe,
        private mSnackbar:MatSnackBar,
        private mFirestore: AngularFirestore,
    ) {
        this.dataSource = new MatTableDataSource<any>()
        this.route.paramMap.subscribe(res => {
            this.mUid = res.get('id') as string
        })
    }

    ngOnInit(): void {
        this.fetchStudentMarks(this.mUid)
        this.fetchStudentData(this.mUid)
    }

    ngOnDestroy(): void {
        this._destroy$.next('')
        this._destroy$.complete()
    }

    private fetchStudentMarks(mUid: string) {
        this.mFirestore.collection('studentResults').doc(mUid).get()
            .pipe(map(x => x.data()))
            .subscribe((res: any) => {
                if (res) this.dataSource.data = res.results as AttendanceHistory[]
                this.dataSource.paginator = this.paginator

                console.log(res)
            })
    }

    printPDF() {
        const students = this.dataSource.data

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
        doc.text('AIM COACHING CLASSES', centerX, 10, {align: 'center'});
        doc.setFontSize(10);
        doc.text(`Name:${students.at(-1)?.name} `, 15, 15)
        doc.text('Batch Name: ' + this.mStudent.batchName, 15, 20, {align: 'left'});
        doc.text(`Roll No:${students.at(-1)?.rollNo} `, 15, 25)
        // doc.text(`Roll No:${this.studentData?.rollNo} `, 15, 25)
        const header = [['Test Name', 'Correct', 'Incorrect', 'Marks Obtained', 'Total Marks', 'Date']];
        const rows = students.map(student => [student.testName, student.rightAnswers, student.wrongAnswers, student.result, student.totalMarks, this.datePipe.transform(student.date.toDate(), 'dd-MM-yyyy')]);
        (doc as any).autoTable({
            head: header,
            body: rows,
            startY: 30,
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
        if (students.length >= 1) doc.save(`${students.at(-1)?.name}.pdf`);
        else this.mSnackbar.open('NO DATA TO DOWNLOAD')._dismissAfter(3000)
    }

    private fetchStudentData(mUid: string) {
        this.mFirestore.collection('students').doc(mUid).get().pipe(
            map(x => x.data())
        ).subscribe(res => {
            this.mStudent = res
        })
    }
}
