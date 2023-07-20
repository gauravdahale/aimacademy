import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Subject, takeUntil} from "rxjs";
import {Router} from "@angular/router";
import {FormControl, FormControlName, FormGroup, Validators} from "@angular/forms";
import {StudentService} from "../services/student.service";
import {DataSource} from "@angular/cdk/collections";
import {MatTableDataSource} from "@angular/material/table";

@Component({
    selector: 'app-students-list',
    templateUrl: './students-list.component.html',
    styleUrls: ['./students-list.component.css']
})
export class StudentsListComponent implements OnInit, OnDestroy {
    _destroyed$ = new Subject()
studentData:any[]=[]
    dataSource =new MatTableDataSource<any>()
    displayedColumns: string[] = ['position', 'studentName', 'studentNumber', 'batchName','action'];

    constructor(
        private matDialog: MatDialog,
        private matSnackBar: MatSnackBar,
        private mFirestore: AngularFirestore,
        private mStudentService: StudentService,
        private router: Router,
    ) {
this.dataSource.data=this.studentData
    }

    addStudent() {
        this.router.navigateByUrl('add-student')
    }

    ngOnDestroy(): void {

        this._destroyed$.next('')
        this._destroyed$.complete()

    }

    ngOnInit(): void {
this.mStudentService.fetchStudents().pipe(takeUntil(this._destroyed$)).subscribe(res=>{
    this.studentData =res
this.dataSource.data =this.studentData
})

    }


}
