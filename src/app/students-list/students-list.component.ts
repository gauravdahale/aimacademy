import {Component, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Observable, Subject, takeUntil} from "rxjs";
import {Router} from "@angular/router";
import {StudentService} from "../services/student.service";
import {MatTableDataSource} from "@angular/material/table";
import {needConfirmation} from "../confirm-dialog/confirm-dialog.decorator";
import {AddStudentComponent} from "../add-student/add-student.component";
import {Student} from "../interfaces/Student";
import {MatSelectChange} from "@angular/material/select";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {TestInfo} from "../model";
import * as jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import 'jspdf-autotable'
import {DatePipe} from "@angular/common";
import {StudentDetailComponent} from "../student-detail/student-detail.component";
@Component({
    selector: 'app-students-list',
    templateUrl: './students-list.component.html',
    styleUrls: ['./students-list.component.scss']
})
export class StudentsListComponent implements OnInit, OnDestroy {
    _destroyed$ = new Subject()
    studentData: any[] = []
    dataSource = new MatTableDataSource<Student>()
    displayedColumns: string[] = window.innerWidth>600? ['position','rollNo' ,'studentName', 'studentNumber','action'] :['position','rollNo','studentName','action'];
    _classes$: Observable<any>;
    classSelected=localStorage.getItem('aimClass') || '';
    @HostListener('window:resize', ['$event'])
    onResize(event: { target: { innerWidth: number; }; }) {
        this.displayedColumns = event.target.innerWidth > 600 ? ['position','rollNo' ,'studentName', 'studentNumber', 'batchName', 'action'] : ['position','rollNo','studentName','action'];
    }
    @ViewChild(MatPaginator) paginator! :MatPaginator
    @ViewChild(MatSort) sort!: MatSort;
    constructor(
        private matDialog: MatDialog,
        private matSnackBar: MatSnackBar,
        private mFirestore: AngularFirestore,
        private  datePipe:DatePipe,

        private mStudentService: StudentService,
        private router: Router,
        private mDialog: MatDialog,

    ) {
        // this.dataSource.data = this.studentData
        // this.dataSource = new MatTableDataSource<Student>()
        // this.dataSource.paginator =this.paginator
        // this.dataSource.sort =this.sort
        this._classes$ = this.mFirestore.collection('class', ref => ref.orderBy('className', 'asc')).valueChanges({idField: 'id'})

    }

    addStudent() {
        this.mDialog.open(AddStudentComponent, {
            width: '600px'
        })
    }

    editStudent(element: Student) {
        this.mDialog.open(AddStudentComponent, {
            data: element,
            width: '600px'
        })
    }
    onClassChange($event: MatSelectChange) {
        const className = $event.value
        this.studentData =[]
        localStorage.setItem('aimClass',className)
        // this.matSnackBar.open(className +' selected')._dismissAfter(3000)
        this.mStudentService.fetchStudentsByClass(className).pipe(takeUntil(this._destroyed$)).subscribe(res => {

            this.studentData = res
           this.dataSource = new MatTableDataSource<Student>()
            this.dataSource.data = this.studentData
            this.dataSource.paginator =this.paginator
            this.dataSource.sort =this.sort
        })
    }
    ngOnDestroy(): void {

        this._destroyed$.next('')
        this._destroyed$.complete()

    }

    ngOnInit(): void {
        this.mStudentService.fetchStudentsByClass(this.classSelected).pipe(takeUntil(this._destroyed$)).subscribe(res => {
            this.studentData = res
            this.dataSource.data = this.studentData
        })

    }

    @needConfirmation()
    delete(element: any) {
        return this.mStudentService.deleteStudent(element.id).then(() => {
            this.matSnackBar.open('Student deleted successfully!')
        })
            .catch(res => {
                this.matSnackBar.open(res)._dismissAfter(3000)
            })
    }


    studentAttendance(id:string) {
        this.router.navigate(['student-attendance',id])
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
        // doc.text('Date: ' +this.datePipe.transform( element.date.toDate(),"dd-MM-yyyy"),  rightX, 10, { align: 'right' });

        const students = this.studentData as any[]
        const header = [['Roll No', 'Name', 'Status','Date']];
        const rows = students.map(student => [student.rollNo, student.name,student.status,this.datePipe.transform(student.date.toDate(),'dd-MM-yyyy')]);

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
        doc.save(`${students[0].name}.pdf`);

    }

    studentResults(id:any) {
        this.router.navigate(['student-detail',id])
    }
}
