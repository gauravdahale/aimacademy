import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {TestModel} from "../../interfaces/TestModel";
import {TestService} from "../../services/test.service";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {TestInfo} from "../../model";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-edit-test',
  templateUrl: './edit-test.component.html',
  styleUrls: ['./edit-test.component.scss']
})
export class EditTestComponent implements OnInit {
  testId?: string; // Store the test ID
  testDetails?: TestInfo; // Store the fetched test details
  editForm: FormGroup;
  studentFormArray?:FormArray
  constructor(private route: ActivatedRoute, private testService: TestService,
              private  readonly router:Router,private matSnackbar:MatSnackBar,
              private fb: FormBuilder){
    this.editForm = this.fb.group({
      testName: ['', [Validators.required, Validators.maxLength(50)]],
      date: ['', Validators.required],
      batchName: ['', [Validators.required, Validators.maxLength(50)]],
      students: this.fb.array([]) // Initialize FormArray for students
    });
  }

  ngOnInit() {
    this.testId = this.route.snapshot.paramMap.get('testId')!;
    this.loadTestData();
  }

  loadTestData() {
    this.testService.getTestById(this.testId!).subscribe(test => {
      if (test) {
        this.testDetails = test;
        this.editForm.patchValue({
          testName: test.testName,
          date: test.date,
          batchName: test.batchName,
        });

        // Load student details into FormArray
       this.studentFormArray = this.editForm.get('students') as FormArray;
        this.studentFormArray.clear();
        test.students.forEach(student => {
          this.studentFormArray?.push(this.fb.group({
            rollNo: student.rollNo,
            name: student.name,
            totalMarks: student.totalMarks,
            correct: student.correct
          }));
        });
      }
    });
  }


  saveChanges() {

      this.testService.updateTest(this.editForm.getRawValue() as TestInfo,this.testDetails?.id!).then(() => {
        this.testService.updateTestMarksByStudent(this.editForm.getRawValue() as TestInfo,this.testDetails?.id!).then(()=>{
        // this.matDialogRef.close()
        this.matSnackbar.open('Updated Successfully')._dismissAfter(3000)
        this.router.navigateByUrl('tests').then(r => this.matSnackbar.open('Test added successfully !')._dismissAfter(3000))
      },  error => {
        // Handle error (show error message)
        alert(error)
      });
    })
    // Perform your form submission logic here




    // Update the test details using the service
    // this.testService.updateTest(this.editForm.getRawValue()!, this.testDetails?.id!).then(() => {
    //   // Handle success (navigate or show feedback)
    //   this.matSnackbar.open('Updated Successfully')._dismissAfter(3000)
    //   this.router.navigateByUrl('tests')
    // }, error => {
    //   // Handle error (show error message)
    //   alert(error)
    // });
  }

  onInputChanged(control: AbstractControl | null): void {
    if (control) {
      control.markAsTouched(); // Mark the control as touched to trigger validation
    }
  }
  numberValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    // alert(isNaN(value))
    if (value !== null && isNaN(value)) {
      return {notANumber: true};
    }
    return null;
  };

}
