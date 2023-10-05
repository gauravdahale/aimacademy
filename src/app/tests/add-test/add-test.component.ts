import {Component, OnInit, ViewChild} from '@angular/core';
import {
    AbstractControl,
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    ValidationErrors,
    ValidatorFn,
    Validators
} from "@angular/forms";
import {TestService} from "../../services/test.service";
import {TestModel} from "../../interfaces/TestModel";
import {MatDialogRef} from "@angular/material/dialog";
import {debounceTime, Observable, startWith, tap} from "rxjs";
import {map} from "rxjs/operators";
import {MatAutocompleteSelectedEvent, MatAutocompleteTrigger} from "@angular/material/autocomplete";
import {StudentService} from "../../services/student.service";
import {Student} from "../../interfaces/Student";
import {MatSelectChange} from "@angular/material/select";
import {NgbAlert} from "@ng-bootstrap/ng-bootstrap";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TestInfo} from "../../model";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";

@Component({
    selector: 'app-add-test',
    templateUrl: './add-test.component.html',
    styleUrls: ['./add-test.component.scss']
})
export class AddTestComponent implements OnInit {
    displayedColumns: string[] = ['name', 'rollNo', 'total', 'correct'];
    positive = new FormControl(1, Validators.required);
    negative = new FormControl(1, Validators.required);
    form!: FormGroup;
    class$: Observable<any>
    totalMarks = new FormControl('100')
    @ViewChild('auto') auto!: MatAutocompleteTrigger;
    students$: Observable<Student[]> | undefined
    students: Student[] = []
    filteredNames: Observable<string[]> | undefined;
    names: string[] = ['John', 'Jane', 'Alice', 'Bob', 'Charlie']; // Sample options
    filteredNamesArray: Observable<string[]>[] = [];
    batschSelected: string | null = null
    classSelected = localStorage.getItem('aimClass') || '';


    // dataSource:FormGroup[];
    isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
        .pipe(
            map(result => result.matches)
        );

    constructor(private fb: FormBuilder,
                private readonly mTestService: TestService,
                // private readonly matDialogRef: MatDialogRef<AddTestComponent>,
                private readonly mStudentService: StudentService,
                private readonly router: Router,
                private readonly matSnackbar: MatSnackBar,
                private breakpointObserver: BreakpointObserver,
                private readonly testService: TestService) {
        this.class$ = this.mTestService.getClass()
        this.form = this.fb.group({
            testName: ['', [Validators.required, Validators.maxLength(50)]],
            date: ['', Validators.required],
            batchName: [this.classSelected, [Validators.required, Validators.maxLength(50)]],
            students: this.fb.array([]),
            positive: this.positive,
            negative: this.negative
        });
        // this.dataSource = this.studentsFormArray.controls.map(studentFormGroup => studentFormGroup.value);

    }

    // Custom validator function to ensure input is not greater than totalMarks
    marksNotGreaterThanTotalValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
        const totalMarks = parseFloat(this.totalMarks.value!); // Convert to a number
        // alert(totalMarks)
        const marksObtained = parseFloat(control.value); // Convert to a number

        if (!isNaN(marksObtained) && !isNaN(totalMarks) && marksObtained > totalMarks) {
            return {marksGreaterThanTotal: true};
        }

        return null;
    };

    ngOnInit() {
        this.batschSelected = localStorage.getItem('aimClass')
        this.students$ = this.mStudentService.fetchStudentsFromBatch(this.batschSelected!)
        this.studentsFormArray.clear()
        this.mStudentService.fetchStudentsFromBatch(this.batschSelected!).pipe(
            map(x => x.map(s => {
                    return {
                        "studentName": s.studentName,
                        "rollNo": s.rollNo,
                        "totalMarks": this.totalMarks?.value,
                        "correct": "",
                        "rightAnswers": "",
                        "wrongAnswers": "",
                    }
                }
            ))
        ).subscribe(res => {
            this.studentsFormArray.clear()
            res.forEach(it => {
                this.addStudent2(it)
            })


            // alert(JSON.stringify(res))
        })


        // this.studentsFormArray.controls.forEach((studentGroup, index) => {
        //     this.filteredNamesArray[index] = studentGroup.get('name')!.valueChanges.pipe(
        //         startWith(''),
        //         map(value => this._filter(value))
        //     );
        // });


    }

    get studentsFormArray() {
        return this.form.get('students') as FormArray;
    }

    getFilteredNames(index: number): Observable<string[]> {
        let c = this.studentsFormArray.at(index).get('name')!.valueChanges.pipe(
            startWith(''),
            // debounceTime(300), // Wait for 300 milliseconds
            map(value => this._filter(value || ''))
        );
// c.subscribe(r=>{
//     console.log('Into getFilteredNames',r)})
        return c
    }

    private _filter(value: string): string[] {
        console.log(value)
        const filterValue = value.toLowerCase();
        let x: string[] = this.names.filter(name => name.toLowerCase().includes(filterValue))
        console.log('intp Filter', x)
        return x
    }

    addStudent() {
        const studentFormGroup = this.fb.group({
            rollNo: ['', Validators.required],
            name: ['', Validators.required],
            totalMarks: [this.totalMarks.value, Validators.required],
            // rank: [''],
            correct: ['']
        });

        this.studentsFormArray.push(studentFormGroup);
        // this.filteredNamesArray[this.studentsFormArray.length - 1] = this.getFilteredNames(this.studentsFormArray.length - 1);
        // this.studentsFormArray.controls.forEach((studentGroup, index) => {
        //     this.filteredNamesArray[index] = this.getFilteredNames(index);
        // });
    }

    addStudent2(student: any) {
        const studentFormGroup = this.fb.group({
            rollNo: [{value: student.rollNo, disabled: true}, Validators.required],
            name: [{value: student.studentName, disabled: true}, Validators.required],
            totalMarks: [this.totalMarks.value, Validators.required],
            // rank: [''],
            correct: [0, [this.numberValidator, this.marksNotGreaterThanTotalValidator, Validators.required, Validators.min(0)]],
            rightAnswers: ['', [this.numberValidator, this.marksNotGreaterThanTotalValidator, Validators.required, Validators.min(0)]],
            wrongAnswers: ['', [this.numberValidator, this.marksNotGreaterThanTotalValidator, Validators.required, Validators.min(0)]]
        });

        this.studentsFormArray.push(studentFormGroup);
        // this.dataSource = this.studentsFormArray.controls.map(control => control.value);

        // this.filteredNamesArray[this.studentsFormArray.length - 1] = this.getFilteredNames(this.studentsFormArray.length - 1);
        // this.studentsFormArray.controls.forEach((studentGroup, index) => {
        //     this.filteredNamesArray[index] = this.getFilteredNames(index);
        // });
    }

    onSubmit() {
        if (this.form.valid) {
            this.testService.addTest(this.form.getRawValue() as TestInfo).then((re) => {

                this.testService.addTestMarksByStudent(this.form.getRawValue() as TestInfo, re.id!).then(() => {

                    // this.matDialogRef.close()

                    this.router.navigateByUrl('tests').then(r => this.matSnackbar.open('Test added successfully !')._dismissAfter(3000))
                })
            })
            // Perform your form submission logic here


        }
    }


    private filterNames(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.names.filter(name => name.toLowerCase().includes(filterValue));
    }

    onBatchSelect($event: MatSelectChange) {
        // this.names=[]
        this.batschSelected = $event.value
        const className = $event.value
        // this.studentData =[]
        localStorage.setItem('aimClass', className)

        this.students$ = this.mStudentService.fetchStudentsFromBatch(this.batschSelected!)
        this.studentsFormArray.clear()
        this.mStudentService.fetchStudentsFromBatch(this.batschSelected!).pipe(
            map(x => x.map(s => {
                    return {
                        "studentName": s.studentName,
                        "rollNo": s.rollNo,
                        "totalMarks": this.totalMarks?.value,
                        "correct": "",
                        "rightAnswers": "",
                        "wrongAnswers": "",
                    }
                }
            ))
        ).subscribe(res => {
            this.studentsFormArray.clear()
            res.forEach(it => {
                this.addStudent2(it)
            })


            // alert(JSON.stringify(res))
        })
        // this.students$.subscribe(res => {
        //     res.forEach(it => {
        //         this.names.push(it.studentName)
        //         this.students = res
        //
        //     })
        // })

    }

    onAutocompleteSelected($event: MatAutocompleteSelectedEvent, i: number) {
        let s = this.students.filter(x => x.studentName == $event.option.value)
        // alert($event.option.value)
        // this.studentsFormArray.at(i).get('rollNo')?.setValue(s[i].rollNo)
    }

    onInputChanged(control: AbstractControl | null): void {
        if (control) {
            control.markAsTouched(); // Mark the control as touched to trigger validation
        }
    }

    RightOnInputChanged(control: AbstractControl | null, i: number): void {
        if (control) {
            control.markAsTouched(); // Mark the control as touched to trigger validation
        }

        // alert(`wrong ${i} ${c}`)
        this.calculateTotalMarks(i)
    }

    WrongOnInputChanged(control: AbstractControl | null, i: number): void {
        if (control) {
            control.markAsTouched(); // Mark the control as touched to trigger validation
        }
        this.calculateTotalMarks(i)

        // alert(`wrong ${i} ${c}`)
    }

    RightControl(i: number) {
        return this.studentsFormArray.at(i).get('rightAnswers')
    }

    WrongControl(i: number) {
        return this.studentsFormArray.at(i).get('wrongAnswers')
    }

    MarksObtained(i: number) {
        return this.studentsFormArray.at(i).get('correct')
    }

    // displayFn(user: string): string {
    //     return user && user ? user : '';
    // }

    onBlur($event: any) {
        // alert($event.target.value)
        this.studentsFormArray.controls.forEach(it => {
            it.get('totalMarks')?.setValue($event.target.value)
        })
    }

    // Custom validator function to ensure value is not greater than totalMarks
    maxMarksValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
        const totalMarks = +this.totalMarks.value!
        // alert(this.totalMarks.value)
        const marksObtained = +control.value;
        if (marksObtained && totalMarks && marksObtained > totalMarks) {
            return {maxMarksExceeded: true};
        }
        return null;
    };
    // Custom validator function to ensure value is an integer
    // Custom validator function to ensure value is a number
    numberValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        // alert(isNaN(value))
        if (value !== null && isNaN(value)) {
            return {notANumber: true};
        }
        return null;
    };

    private calculateTotalMarks(i: number) {
        let right = this.RightControl(i)?.value || 0
        let wrong = this.WrongControl(i)?.value || 0
        let positive = this.positive.value || 0
        let negative = this.negative.value || 0
        let obtained = (right * positive) - (wrong * negative)
        this.MarksObtained(i)?.setValue(obtained)
    }
}

// Custom validator function to ensure value is not greater than totalMarks
