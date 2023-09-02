import { Component, OnInit, ViewChild } from '@angular/core';
import { StudentService } from '../services/student.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentAttendance } from '../model';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import {Student} from "../interfaces/Student";

@Component({
    selector: 'app-student-attendance',
    templateUrl: './student-attendance.component.html',
    styleUrls: ['./student-attendance.component.scss']
})
export class StudentAttendanceComponent implements OnInit {
    mData: StudentAttendance[] = [];
    id?: string;
studentData?:Student
    displayedColumns: string[] = ['date', 'studentName', 'className', 'status', 'rollNo'];
    dataSource: MatTableDataSource<StudentAttendance>;

    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(
        private readonly mService: StudentService,
        private readonly router: Router,
        private readonly route: ActivatedRoute
    ) {
        this.dataSource = new MatTableDataSource<StudentAttendance>([]);
        route.paramMap.subscribe(pram => {
            let a = pram.get('id');
            if (a) this.id = a;
        });
    }

    ngOnInit(): void {
        if (this.id)
            this.mService.fetchStudentById(this.id).subscribe(res=>{
                this.studentData=res
            })

        if (this.id)
            this.mService.fetchStudentAttendance(this.id).subscribe((res) => {
       if(res['attendance'])         this.mData = res['attendance'] as StudentAttendance[];
               if(this.mData) {
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
}
