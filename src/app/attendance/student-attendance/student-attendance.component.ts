import {Component, OnInit, ViewChild} from '@angular/core';
import {StudentService} from '../../services/student.service';
import {ActivatedRoute, Router} from '@angular/router';
import {StudentAttendance} from '../../model';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {Student} from "../../interfaces/Student";
import * as jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import 'jspdf-autotable'
import {DatePipe} from "@angular/common";

@Component({
    selector: 'app-student-attendance',
    templateUrl: './student-attendance.component.html',
    styleUrls: ['./student-attendance.component.scss']
})
export class StudentAttendanceComponent implements OnInit {
    mData: StudentAttendance[] = [];
    id?: string;
    studentData?: Student
    displayedColumns: string[] = ['rollNo', 'studentName', 'status', 'date',];
    dataSource: MatTableDataSource<StudentAttendance>;
    studentDataLoading = false
    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(
        private readonly mService: StudentService,
        private readonly router: Router,
        private readonly route: ActivatedRoute,
        private readonly datePipe: DatePipe,
    ) {
        this.dataSource = new MatTableDataSource<StudentAttendance>([]);
        route.paramMap.subscribe(pram => {
            let a = pram.get('id');
            if (a) this.id = a;

        });
    }

    ngOnInit(): void {
        if (this.id) this.mService.fetchStudentById(this.id).subscribe(res => {
            this.studentDataLoading = true
            this.studentData = res
            this.studentDataLoading = false
        })

        if (this.id)
            this.mService.fetchStudentAttendance(this.id).subscribe((res) => {
                if (res['attendance']) this.mData = res['attendance'] as StudentAttendance[];
                if (this.mData) {
                    // Manually sort the data by the 'date' property in descending order
                    this.mData.sort((a, b) =>
                        new Date(b.date.split('-').reverse().join('-')).getTime() -
                        new Date(a.date.split('-').reverse().join('-')).getTime()
                    );

                    this.dataSource.data = this.mData;
                    this.dataSource.sort = this.sort; // Connect the sort to dataSource
                    this.dataSource.paginator = this.paginator; // Connect the paginator to dataSource}
                }
            });
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
        doc.text('AIM COACHING CLASSES', centerX, 10, {align: 'center'});
        doc.setFontSize(10);
        // doc.text('Date: ' +this.datePipe.transform( element.date.toDate(),"dd-MM-yyyy"),  rightX, 10, { align: 'right' });
        doc.text(`Name:${this.studentData?.studentName} `, 15, 15)
        doc.text(`Batch Name:${this.studentData?.batchName} `, 15, 20)
        doc.text(`Roll No:${this.studentData?.rollNo} `, 15, 25)
        const students = this.mData as StudentAttendance[]
        const header = [['Roll No', 'Name', 'Status', 'Date']];
        const rows = students.map(student => [student.rollNo, student.studentName, student.status, student.date]);

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
        doc.save(`${this.studentData?.studentName}.pdf`);

    }


}
