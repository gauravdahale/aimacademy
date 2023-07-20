import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Observable} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {StudentService} from "../services/student.service";

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css']
})
export class AddStudentComponent implements OnInit{
  batch$ :Observable<any[]>
  form:any
  latestCounter: number = 0

constructor(private readonly mFirestore:AngularFirestore,
            private  readonly matSnackBar:MatSnackBar,
            private readonly mStudentService:StudentService,
            private mRouter:Router
            ) {
  this.initForm()
this.batch$ = this.mFirestore.collection('class').valueChanges({idField:'id'})
  }

  ngOnInit(): void {
    this.mStudentService.fetchLatestStudentCounter().then(res => {
      this.latestCounter = res.val()

    })
  }

  private initForm() {
    this.form = new FormGroup({
      studentName:new FormControl('',Validators.required),
      fathersName:new FormControl('',Validators.required),
      studentNumber:new FormControl('',Validators.required),
      address:new FormControl('',Validators.required),
      fathersNumber:new FormControl('',Validators.required),
      collegeName:new FormControl('',Validators.required),
      standard:new FormControl('',Validators.required),
      batchName:new FormControl('',Validators.required),
      city:new FormControl('',Validators.required),
    })
  }
  get StudentName(){
    return this.form.get('studentName')
  }
  get FatherName(){
    return this.form.get('fathersName')
  }
  get StudentNumber(){
   return  this.form.get('studentNumber')
  }
  get Address(){
    return this.form.get('address')
  }
  get FathersNumber(){
    return this.form.get('fathersNumber')
  }
  get CollegeName(){
    return this.form.get('collegeName')
  }
  get City(){
    return this.form.get('city')
  }
  get BatchName(){
    return this.form.get('batchName')
  }
  get Standard(){
    return this.form.get('standard')
  }

Submit(){
    if(this.form.valid){
    this.mFirestore.collection('students').doc(this.latestCounter!.toString()).set(this.form.value).then(()=>{
      this.mStudentService.updateCounter()
      this.matSnackBar.open('Student Added Successfully')._dismissAfter(3000)
this.mRouter.navigateByUrl('student-list')
    })
    }
else {
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
