import { Injectable } from '@angular/core';
import {TestModel} from "../interfaces/TestModel";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {shareReplay} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor(private readonly mFirestore:AngularFirestore) { }

  addTest(value: TestModel) {
      return this.mFirestore.collection('tests').add(value)

  }

  fetchTests() {
    return this.mFirestore.collection<TestModel>('tests',ref => ref.orderBy('date',"desc")).valueChanges()
  }
  getClass(){
    return this.mFirestore.collection('class').valueChanges().pipe(shareReplay(1))
  }
}
