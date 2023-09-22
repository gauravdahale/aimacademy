import {Component, ViewChild} from '@angular/core';
import {Observable, Subject, takeUntil} from "rxjs";
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AddTestComponent} from "../add-test/add-test.component";
import {TestService} from "../../services/test.service";
import {TestModel} from "../../interfaces/TestModel";
import {Router} from "@angular/router";
import {TestInfo} from "../../model";
// import jsPDF, { jsPDF as JSPDF } from 'jspdf';
import * as jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import 'jspdf-autotable'
import {DatePipe} from "@angular/common";
import {MatSelectChange} from "@angular/material/select";
import {Student} from "../../interfaces/Student";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
@Component({
    selector: 'app-test-list',
    templateUrl: './test-list.component.html',
    styleUrls: ['./test-list.component.scss']
})
export class TestListComponent {
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    classSelected=localStorage.getItem('aimClass') || '';

    _destroyed$ = new Subject()
    displayedColumns: string[] = ['position', 'testName', 'batchName','testDate', 'action'];
    data: TestInfo[] = []
    datasource: MatTableDataSource<any>
    _classes$: Observable<any>;


    constructor(private marDialog: MatDialog,
                private matSnackBar: MatSnackBar,
                private readonly router:Router,
                private  datePipe:DatePipe,
                private readonly mFirestore:AngularFirestore,
                private readonly mTestService:TestService) {
        this.datasource = new MatTableDataSource<any>(this.data)
        this._classes$ = this.mFirestore.collection('class', ref => ref.orderBy('className', 'asc')).valueChanges({idField: 'id'})

    }

    ngOnInit(): void {
        this.mTestService.fetchTestsByClass(this.classSelected).pipe(takeUntil(this._destroyed$))
            .subscribe(res => {
                this.data = res
                this.datasource = new MatTableDataSource<any>(this.data)
                this.datasource.paginator =this.paginator
                this.datasource.sort =this.sort
            })
    }

    ngOnDestroy(): void {
        this._destroyed$.next('')
        this._destroyed$.complete()
    }


    addTest() {
        this.router.navigateByUrl('add-test')
        // this.marDialog.open(AddTestComponent)
    }

    printPDF(element:TestInfo) {
// Sort the student array by 'correct' field in descending order
        const sortedStudents = element.students.sort((a, b) => +b.correct - +a.correct);
        sortedStudents.forEach((student, index) => {
            student.rank = index + 1; // Adding 1 to make the rank start from 1
        });
        const doc = new jsPDF.default();  // Use '.default' for jsPDF typings
        const centerX = doc.internal.pageSize.width / 2;
        const rightX = doc.internal.pageSize.width - 20;

        // Add test name and date on top
        doc.setFontSize(12);
        doc.text( element.testName, 20, 10);
        doc.text('AIM COACHING CLASSES', centerX, 10, { align: 'center' });
        doc.text('Date: ' +this.datePipe.transform( element.date.toDate(),"dd-MM-yyyy"),  rightX, 10, { align: 'right' });

        const students = element.students as any[]
        const header = [['Roll No', 'Name', 'Total Marks','Rank', 'Marks Obtained','Correct','Incorrect']];
        const rows = students.map(student => [student.rollNo, student.name, student.totalMarks,student.rank, student.correct,student.rightAnswers,student.wrongAnswers]);

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
        doc.save('student_information.pdf');

    }

    edit(id:string) {
        this.router.navigate(['/edit-test', id]);

    }

    onClassChange($event: MatSelectChange) {
        const className = $event.value
        // this.studentData =[]
        localStorage.setItem('aimClass',className)

        this.matSnackBar.open(className +' selected')._dismissAfter(3000)
        this.mTestService.fetchTestsByClass(className).pipe(takeUntil(this._destroyed$))
            .subscribe(res => {
                this.data = res
                this.datasource = new MatTableDataSource<any>(this.data)
this.datasource.paginator =this.paginator
this.datasource.sort =this.sort
            })


        // this.mStudentService.fetchStudentsByClass(className).pipe(takeUntil(this._destroyed$)).subscribe(res => {

            // this.studentData = res
            // this.dataSource = new MatTableDataSource<Student>()
            // this.dataSource.data = this.studentData
            // this.dataSource.paginator =this.paginator
            // this.dataSource.sort =this.sort
        // })
    }
}
