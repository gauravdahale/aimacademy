import {Component, Inject, OnInit} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Observable} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {StudentService} from "../services/student.service";
import {Student} from "../interfaces/Student";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ngbAlertFadingTransition} from "@ng-bootstrap/ng-bootstrap/alert/alert-transition";

@Component({
    selector: 'app-add-student',
    templateUrl: './add-student.component.html',
    styleUrls: ['./add-student.component.scss']
})
export class AddStudentComponent implements OnInit {
    batch$: Observable<any[]>
    mode="Add"
    form: any
    latestCounter: number = 0

    ngOnInit(): void {
        this.mStudentService.fetchLatestStudentCounter().then(res => {
            this.latestCounter = res.val()

        })
    }

    constructor(private readonly mFirestore: AngularFirestore,
                private readonly matSnackBar: MatSnackBar,
                private readonly mStudentService: StudentService,
                private mRouter: Router,
                readonly mDialogRef: MatDialogRef<AddStudentComponent>,
                @Inject(MAT_DIALOG_DATA) public data?: Student,
    ) {

        this.batch$ = this.mFirestore.collection('class').valueChanges({idField: 'id'})
    if(data!=null) {
        this.mode = 'Edit'
    }
        this.initForm()
    }

    private initForm() {
        this.form = new FormGroup({
            studentName: new FormControl(this.data?.studentName, Validators.required),
            rollNo: new FormControl(this.data?.rollNo, Validators.required),
            studentNumber: new FormControl(this.data?.studentNumber, Validators.required),
            fathersName: new FormControl(this.data?.fathersName, Validators.required),
            fathersNumber: new FormControl(this.data?.fathersNumber, Validators.required),
            batchName: new FormControl(this.data?.batchName, Validators.required),
            collegeName: new FormControl(this.data?.collegeName, Validators.required),
            // city: new FormControl(this.data?.city, Validators.required),
        })
    }

    get StudentName() {
        return this.form.get('studentName')
    }

    get StudentNumber() {
        return this.form.get('studentNumber')
    }

    get CollegeNAme() {
        return this.form.get('collegeName')
    }
    get City(){
        return this.form.get('city')
    }
    get RollNo() {
        return this.form.get('rollNo')
    }

    get ParentsNumber() {
        return this.form.get('fathersNumber')
    }

    get FathersName() {
        return this.form.get('fathersName')
    }


    get BatchName() {
        return this.form.get('batchName')
    }

    Submit() {
        if (this.form.valid && this.data==null) {
            this.mFirestore.collection('students').doc(this.latestCounter!.toString()).set(this.form.value).then(() => {
                this.mStudentService.updateCounter()
                this.matSnackBar.open('Student Added Successfully')._dismissAfter(3000)
                this.mDialogRef.close()
            })
        }
        if (this.form.valid && this.data!=null) {
            this.mFirestore.collection('students').doc(this.data.id).update(this.form.value).then(() => {
                // this.mStudentService.updateCounter()
                this.matSnackBar.open('Student Edited Successfully')._dismissAfter(3000)
                this.mDialogRef.close()
            })
        }
        else if(!this.form.valid) {
            this.matSnackBar.open('Form is invalid')._dismissAfter(3000)
            this.findInvalid()
        }
    }

    private findInvalid() {

        const invalid = [];
        const controls = this.form.controls;
        for (const name in controls) {
            if (controls[name].invalid) {
                invalid.push(name);
            }
        }
        return invalid;


    }
}
