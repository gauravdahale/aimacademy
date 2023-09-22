import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {AngularFirestore, DocumentData} from "@angular/fire/compat/firestore";
import {MatDialog} from "@angular/material/dialog";
import {GalleryService} from "../gallery/gallery.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AddGalleryComponent} from "../gallery/add-gallery/add-gallery.component";
import {SliderService} from "./slider.service";
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {AddSliderComponent} from "./add-slider/add-slider.component";

@Component({
  selector: 'app-slider-list',
  templateUrl: './slider-list.component.html',
  styleUrls: ['./slider-list.component.scss']
})
export class SliderListComponent implements  OnInit{
  mlist:Observable<unknown[]|any>
  data:any
  constructor(private readonly mDialog:MatDialog,
              private readonly mSlider:SliderService,
              private  readonly mDatabase:AngularFireDatabase,
              private readonly mSnackBar:MatSnackBar
  ) {

    this.mlist= this.mSlider.getData()
    this.mSlider.getData().subscribe(res=>{
      this.data = res
    })

  }

  addSlider(){
    this.mDialog.open(AddSliderComponent,{

    })
  }

  ngOnInit(): void {
  }

  delete(id: any, url: any) {
    // alert(id)
    this.mSlider.deleteImageFromStorage(id,url)
        .then(()=>{

          this.mDatabase.object('homeSlider/'+id).remove().then(()=>{
            this.mSnackBar.open('Deleted successfully')._dismissAfter(3000)
          })

        })
  }
}
