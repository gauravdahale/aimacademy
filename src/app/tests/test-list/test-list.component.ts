import {Component} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AddTestComponent} from "../add-test/add-test.component";
import {TestService} from "../../services/test.service";
import {TestModel} from "../../interfaces/TestModel";
import {Router} from "@angular/router";

@Component({
    selector: 'app-test-list',
    templateUrl: './test-list.component.html',
    styleUrls: ['./test-list.component.scss']
})
export class TestListComponent {
    _destroyed$ = new Subject()
    displayedColumns: string[] = ['position', 'testName', 'testDate', 'batchName', 'action'];
    data: TestModel[] = []
    datasource: MatTableDataSource<any>

    constructor(private marDialog: MatDialog,
                private matSnackBar: MatSnackBar,
                private readonly router:Router,
                private readonly mTestService:TestService) {
        this.datasource = new MatTableDataSource<any>(this.data)
    }

    ngOnInit(): void {
        this.mTestService.fetchTests().pipe(takeUntil(this._destroyed$))
            .subscribe(res => {
                this.data = res
                this.datasource = new MatTableDataSource<any>(this.data)

            })
    }

    ngOnDestroy(): void {
        this._destroyed$.next('')
        this._destroyed$.complete()
    }


    addTest() {
        this.router.navigateByUrl('add-test')
        // this.marDialog.open(AddTestComponent)
    }
}
