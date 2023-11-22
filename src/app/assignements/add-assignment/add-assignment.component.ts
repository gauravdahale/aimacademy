import { Component } from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {DateAdapter} from "@angular/material/core";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Observable} from "rxjs";

@Component({
  selector: 'app-add-assignment',
  templateUrl: './add-assignment.component.html',
  styleUrls: ['./add-assignment.component.scss']
})
export class AddAssignmentComponent{
  description=new FormControl('',Validators.required);
  selectedFile: File | null = null;
classSelected= localStorage.getItem('aimClass')
  _classes$: Observable<any>;

  constructor(private storage: AngularFireStorage,
              private snackbar:MatSnackBar,
              private matDialog:MatDialogRef<AddAssignmentComponent>,

              private readonly mFirestore:AngularFirestore,
              private firestore:AngularFirestore) {
    this._classes$ = this.mFirestore.collection('class', ref => ref.orderBy('className', 'asc')).valueChanges({idField: 'id'})

  }
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      // File is selected
      this.selectedFile = file;

      // You can also display the file name or other information to the user
      console.log(`Selected File: ${file.name}`);
    }
  }
  uploadPDF() {
    // let file  =this.selectedFile
    if (this.selectedFile?.name.toLowerCase().endsWith('.pdf') && this.description.valid) {
      const filePath = `pdfs/${this.selectedFile!.name}`;
      const fileRef = this.storage.ref(filePath);

      const task = this.storage.upload(filePath, this.selectedFile);

      task.snapshotChanges().subscribe(
          (snapshot) => {
            if (snapshot?.bytesTransferred === snapshot?.totalBytes) {
              // Upload is complete
              console.log('Upload complete');
            }
            if (snapshot?.state === 'success') {
              fileRef.getDownloadURL().subscribe((downloadUrl) => {
                // Save the download URL to Firestore
                this.saveUrlToFirestore(downloadUrl,this.classSelected||'');
              });
            }
          },
          (error) => {
            // Handle upload errors
          }
      );
    } else  {
      if(this.description.invalid){
        this.snackbar.open("enter description")._dismissAfter(3000)
      }
      this.snackbar.open('Select a  pdf file only')._dismissAfter(3000)
    }
  }
  saveUrlToFirestore(downloadUrl: string,selectedClass:string) {
    let obj ={
      'className':selectedClass,
      "fileUrl":downloadUrl,
      "date":new Date(),
      "description":this.description.value
    }

    this.firestore
        .collection('assignments')

        .add(obj)
        .then(() => {
          this.snackbar.open("File Uploaded Successfully")._dismissAfter(3000)
          this.matDialog.close()
          // URL saved to Firestore
        })
        .catch((error:any) => {
          // Handle Firestore update errors
        });
  }


}

