import {Component, OnInit} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Observable, takeUntil} from "rxjs";
import {MatTableDataSource} from "@angular/material/table";
import {MatSelectChange} from "@angular/material/select";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    classSelected=localStorage.getItem('aimClass') || '';
    _classes$: Observable<any>
     cards: any[]=[]

    constructor(private matSnackBar: MatSnackBar,
                private readonly mFirestore: AngularFirestore) {
        this._classes$ = this.mFirestore.collection('class', ref => ref.orderBy('className', 'asc')).valueChanges({idField: 'id'})
    // this.matSnackBar.open(this.classSelected)._dismissAfter(3000)
    }

    ngOnInit(): void {
      this.cards = [
            // { title: 'Classes', icon: 'schedule',url:'/class-list' },
            { title: 'Attendance', icon: 'schedule',url:'/attendance' },
            { title: 'Students', icon: 'group',url:'/student-list' },
            { title: 'Tests', icon: 'book',url:'/tests' },
            { title: 'Messages', icon: 'message',url:'/messages' },
            { title: 'Assignments', icon: 'assignment',url:'/assignments' },
            { title: 'Users', icon: 'person',url:'/users' },
        ];
    }

    onClassChange($event: MatSelectChange) {
        const className = $event.value
    localStorage.setItem('aimClass',className)
        this.matSnackBar.open(className +' selected')._dismissAfter(3000)
    }
}
