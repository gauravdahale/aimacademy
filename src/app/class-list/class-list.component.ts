import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {AddClassComponent} from "../add-class/add-class.component";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {MatTableDataSource} from "@angular/material/table";
import {Subject, takeUntil} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
    selector: 'app-class-list',
    templateUrl: './class-list.component.html',
    styleUrls: ['./class-list.component.css']
})
export class ClassListComponent implements OnInit, OnDestroy {
    _destroyed$ = new Subject()
    displayedColumns: string[] = ['position', 'className', 'action'];
    data: any[] = []
    datasource: MatTableDataSource<any>

    constructor(private marDialog: MatDialog,
                private matSnackBar:MatSnackBar,
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
        this.mFirestore.collection('class',ref => ref.orderBy('className','asc')).valueChanges({idField: 'id'}).pipe(takeUntil(this._destroyed$))
            .subscribe(res => {
                this.data = res
                this.datasource = new MatTableDataSource<any>(this.data)

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
                data:data
            })

    }
    delete(data:any){
this.mFirestore.collection('class').doc(data.id).delete().then(()=>{
    this.matSnackBar.open(`${data.className} deleted successfully`)._dismissAfter(3000)
})
    }
}
