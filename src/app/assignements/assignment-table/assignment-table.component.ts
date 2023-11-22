import {Component, OnInit, ViewChild} from '@angular/core';
import {AngularFireStorage} from "@angular/fire/compat/storage";

import {AngularFirestore} from "@angular/fire/compat/firestore";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {AddAssignmentComponent} from "../add-assignment/add-assignment.component";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-assignment-table',
  templateUrl: './assignment-table.component.html',
  styleUrls: ['./assignment-table.component.scss']
})

export class AssignmentTableComponent implements OnInit{
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['className','description', 'fileUrl','date','symbol']; // Add more column names if needed
dataSource:MatTableDataSource<any>
  pdfFiles: any[] = [
    { description: 'PDF File 1',fileUrl: "120" },
    { description: 'PDF File 2', fileUrl: "90" },
    // Add more data as needed
  ];

  constructor(private storage: AngularFireStorage,
              private matDialog:MatDialog,
              private mSnackbar:MatSnackBar,

              private firestore:AngularFirestore)
  {
this.dataSource = new MatTableDataSource()
  }


  openDialog() {
    this.matDialog.open(AddAssignmentComponent)
  }

  ngOnInit(): void {
let pdfFiles$ = this.firestore.collection('assignments').valueChanges({idField:'id'});
pdfFiles$.subscribe(res=>{

  this.pdfFiles=res
  this.dataSource.data = this.pdfFiles
  this.dataSource.paginator =this.paginator
})
  }

  deleteFileAndNode(element:any) {
    // 1. Delete file from Firebase Storage
    const fileRef = this.storage.storage.refFromURL(element.fileUrl);
    return fileRef.delete().then(() => {
      // 2. Delete node from Firestore
       this.firestore.collection('assignments').doc(element.id).delete().then(res=>{
         this.mSnackbar.open('Deleted successfully!')
       });
    }).catch(error => {
      console.error('Error deleting file:', error);
      throw error; // Or handle the error as needed
    });
  }
}
