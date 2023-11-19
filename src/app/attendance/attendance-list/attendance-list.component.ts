import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {MatTableDataSource} from "@angular/material/table";
import {Observable, Subject, takeUntil} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {AddAttendanceComponent} from "../add-attendance/add-attendance.component";
import {StudentAttendance} from "../../model";
import {ViewAttendanceComponent} from "../student-attendance/view-attendance/view-attendance.component";
import {MatSelectChange} from "@angular/material/select";
import {MatPaginator} from "@angular/material/paginator";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {map, shareReplay} from "rxjs/operators";

@Component({
    selector: 'app-attendance-list',
    templateUrl: './attendance-list.component.html',
    styleUrls: ['./attendance-list.component.scss']
})
export class AttendanceListComponent implements OnInit, OnDestroy, AfterViewInit {
    isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
        .pipe(
            map(result => result.matches),
            shareReplay()
        );
    isHandset = false
    displayedColumns: string[] = !this.isHandset ? ['position', 'className', 'date', 'present', 'absent', 'total', 'action'] : ['position', 'date', 'present', 'absent', 'total', 'action'];

    // displayedColumns: string[] = ['position', 'className', 'date', 'present','absent','total','action'];
    dataSource = new MatTableDataSource<any>()
    data: any
    destroyed$ = new Subject()
    batch$: Observable<any>
    batchSelected: any;
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(private readonly mFirestore: AngularFirestore,
                private readonly mDialog: MatDialog,
                private breakpointObserver: BreakpointObserver,
                private readonly matSnackBar: MatSnackBar) {
        this.batch$ = this.mFirestore.collection('class').valueChanges()

    }

    ngOnInit(): void {
        this.isHandset$.subscribe(res => {
            console.log('HANDEST_MODE:', res)
            this.isHandset = res
            this.displayedColumns = !this.isHandset ? ['position', 'className', 'date', 'present', 'absent', 'total', 'action'] : ['position', 'date', 'present', 'absent', 'total', 'action'];

        })
    }

    search() {
        if (this.batchSelected != null) {
            this.mFirestore.collection('attendance').doc(this.batchSelected).collection('attendance').valueChanges({idField: 'id'}).pipe(takeUntil(this.destroyed$))
                .subscribe(res => {
                    this.data = res
                    this.dataSource.data = this.data
                })
        } else this.matSnackBar.open('Please select a batch first')._dismissAfter(3000)
    }

    ngOnDestroy(): void {
        this.destroyed$.next('')
        this.destroyed$.complete()
    }

    getPresent(attendance: any[]) {
        return attendance.filter((x: any) => x.status == 'Present').length
    }

    getAbsent(attendance: any) {
        return attendance.filter((x: any) => x.status == 'Absent').length

    }

    getTotal(attendance: any) {
        return attendance.length

    }

    AddAttendance() {
        this.mDialog.open(AddAttendanceComponent, {
            width: '100%',
            height: '80%'
        })
    }

    viewAttendance(record: any) {
        this.mDialog.open(ViewAttendanceComponent, {
            width: '100%',
            height: '80%',
            data: record
        })
    }

    onBatchSelect($event: MatSelectChange) {
        this.batchSelected = $event.value
        this.mFirestore.collection('attendance').doc(this.batchSelected).collection('attendance').valueChanges({idField: 'id'}).pipe(takeUntil(this.destroyed$))
            .subscribe(res => {
                this.data = res
                this.dataSource.data = this.data
            })
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator
    }
}
