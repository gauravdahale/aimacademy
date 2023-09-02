import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {AddGalleryComponent} from "./add-gallery/add-gallery.component";
import {GalleryService} from "./gallery.service";
import {AngularFirestore, DocumentData} from "@angular/fire/compat/firestore";
import {Observable} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements  OnInit{
  mlist:Observable<DocumentData[]>
  constructor(private readonly mDialog:MatDialog,
  private readonly mGallery:GalleryService,
              private  readonly mFirestore:AngularFirestore,
              private readonly mSnackBar:MatSnackBar
              ) {

    this.mlist= this.mGallery.getData()

  }

addGallery(){
    this.mDialog.open(AddGalleryComponent,{

    })
}

  ngOnInit(): void {
  }

  delete(id: any, url: any) {
    // alert(id)
this.mGallery.deleteImageFromStorage(id,url)
    .then(()=>{
       this.mFirestore.collection('gallery').doc(id).delete().then(()=>{
         this.mSnackBar.open('Deleted successfully')._dismissAfter(3000)
       })

    })
  }
}
