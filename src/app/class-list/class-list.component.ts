import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {AddClassComponent} from "../add-class/add-class.component";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {MatTableDataSource} from "@angular/material/table";
import {Subject, takeUntil} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {needConfirmation} from "../confirm-dialog/confirm-dialog.decorator";
import {StudentService} from "../services/student.service";

@Component({
    selector: 'app-class-list',
    templateUrl: './class-list.component.html',
    styleUrls: ['./class-list.component.scss']
})
export class ClassListComponent implements OnInit, OnDestroy {
    _destroyed$ = new Subject()
    displayedColumns: string[] = window.innerWidth > 600 ? ['position', 'className','studentCount', 'action'] : ['position', 'action'];
    data: any[] = []
    datasource: MatTableDataSource<any>
    mStudents: any[] = []

    constructor(private marDialog: MatDialog,
                private matSnackBar: MatSnackBar,
                private mStudentService: StudentService,
                private readonly mFirestore: AngularFirestore) {
        this.datasource = new MatTableDataSource<any>(this.data)
    }

    addClass() {
        this.marDialog.open(AddClassComponent,
            {
                width: '600px',
            })
    }

    ngOnInit(): void {
        this.mFirestore.collection('class', ref => ref.orderBy('className', 'asc')).valueChanges({idField: 'id'}).pipe(takeUntil(this._destroyed$))
            .subscribe(res => {
                this.data = res
                this.datasource = new MatTableDataSource<any>(this.data)

            })
this.mStudentService.fetchStudents().pipe(takeUntil(this._destroyed$)).subscribe(res=>{
    this.mStudents =res

})
    }

    ngOnDestroy(): void {
        this._destroyed$.next('')
        this._destroyed$.complete()
    }

    edit(data: any) {
        this.marDialog.open(AddClassComponent,
            {
                width: '600px',
                data: data
            })

    }

    @needConfirmation()

    delete(data: any) {
        this.mFirestore.collection('class').doc(data.id).delete().then(() => {
            this.matSnackBar.open(`${data.className} deleted successfully`)._dismissAfter(3000)
        })
    }

    getStudentsCount(element:string) {
     return this.mStudents.filter(x=>x.batchName ==element).length
    }
}
