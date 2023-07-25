import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Subject, takeUntil} from "rxjs";
import {Router} from "@angular/router";
import {FormControl, FormControlName, FormGroup, Validators} from "@angular/forms";
import {StudentService} from "../services/student.service";
import {DataSource} from "@angular/cdk/collections";
import {MatTableDataSource} from "@angular/material/table";
import {needConfirmation} from "../confirm-dialog/confirm-dialog.decorator";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {AddStudentComponent} from "../add-student/add-student.component";
import {Student} from "../interfaces/Student";

@Component({
    selector: 'app-students-list',
    templateUrl: './students-list.component.html',
    styleUrls: ['./students-list.component.css']
})
export class StudentsListComponent implements OnInit, OnDestroy {
    _destroyed$ = new Subject()
    studentData: any[] = []
    dataSource = new MatTableDataSource<Student>()
    displayedColumns: string[] = ['position', 'studentName', 'studentNumber', 'batchName', 'action'];

    constructor(
        private matDialog: MatDialog,
        private matSnackBar: MatSnackBar,
        private mFirestore: AngularFirestore,
        private mStudentService: StudentService,
        private router: Router,
        private mDialog: MatDialog,
    ) {
        this.dataSource.data = this.studentData
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

    ngOnDestroy(): void {

        this._destroyed$.next('')
        this._destroyed$.complete()

    }

    ngOnInit(): void {
        this.mStudentService.fetchStudents().pipe(takeUntil(this._destroyed$)).subscribe(res => {
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


}
