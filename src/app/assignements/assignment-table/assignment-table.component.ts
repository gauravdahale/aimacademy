import {Component, OnInit} from '@angular/core';
import {AngularFireStorage} from "@angular/fire/compat/storage";

import {AngularFirestore} from "@angular/fire/compat/firestore";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {AddAssignmentComponent} from "../add-assignment/add-assignment.component";

@Component({
  selector: 'app-assignment-table',
  templateUrl: './assignment-table.component.html',
  styleUrls: ['./assignment-table.component.scss']
})

export class AssignmentTableComponent implements OnInit{
  displayedColumns: string[] = ['description', 'fileUrl','date','symbol']; // Add more column names if needed

  pdfFiles: any[] = [
    { description: 'PDF File 1',fileUrl: "120" },
    { description: 'PDF File 2', fileUrl: "90" },
    // Add more data as needed
  ];

  constructor(private storage: AngularFireStorage,
              private matDialog:MatDialog,

              private firestore:AngularFirestore)
  {

  }


  openDialog() {
    this.matDialog.open(AddAssignmentComponent)
  }

  ngOnInit(): void {
let pdfFiles$ = this.firestore.collection('assignments').valueChanges({idField:'id'});
pdfFiles$.subscribe(res=>{
  this.pdfFiles=res
})
  }

  delete(id:any) {
    
  }
}
