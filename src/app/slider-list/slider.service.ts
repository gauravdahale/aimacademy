import { Injectable } from '@angular/core';
import {ɵFormGroupValue, ɵTypedOrUntyped} from "@angular/forms";
import {addDoc, collection, collectionData, Firestore} from "@angular/fire/firestore";
import {Database, list, listVal, push, ref} from "@angular/fire/database";
import {AngularFireStorage} from "@angular/fire/compat/storage";

@Injectable({
  providedIn: 'root'
})
export class SliderService {

  constructor(private readonly mFireStore:Firestore,
              private  readonly mDatabase:Database,
              private readonly mStorage:AngularFireStorage) { }

  addImage(value: ɵTypedOrUntyped<any, ɵFormGroupValue<any>, any>) {
    console.log(value)
    const mRef = ref(this.mDatabase, 'homeSlider')
    return push(mRef, value)
  }

  getData() {
    const mRef = ref(this.mDatabase, 'homeSlider')
    return listVal(mRef,{keyField:'id'})
  }

  deleteImageFromStorage(id: string, url: any): Promise<void> {
    const storageRef = this.mStorage.refFromURL(url)
    // const storageRef = getStorage(this.mStorage,imagePath)
    return   storageRef.delete().toPromise()
  }

}
