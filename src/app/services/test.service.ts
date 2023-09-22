import { Injectable } from '@angular/core';
import {TestModel} from "../interfaces/TestModel";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {shareReplay} from "rxjs/operators";
import {Observable} from "rxjs";
import {TestInfo} from "../model";
import firebase from "firebase/compat/app";

@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor(private readonly mFirestore:AngularFirestore) { }

  addTest(value: TestInfo) {
      return this.mFirestore.collection('tests').add(value)

  }

  fetchTests() {

    return this.mFirestore.collection<TestInfo>('tests',ref => ref.orderBy('date',"desc")).valueChanges({idField:'id'})
  }
  fetchTestsByClass(className:string) {

    return this.mFirestore.collection<TestInfo>('tests',ref => ref.orderBy('date',"desc").where('batchName','==',className)).valueChanges({idField:'id'})
  }
  getClass(){
    return this.mFirestore.collection('class').valueChanges().pipe(shareReplay(1))
  }
  getTestById(testId: string): Observable<TestInfo|undefined> {
    return  this.mFirestore.collection('tests').doc<TestInfo>(testId).valueChanges({idField:'id'})
    // Fetch the test document from Firestore based on testId
    // return this.mFirestore.collection('tests').doc<TestModel>(testId).valueChanges();
  }
  addTestMarksByStudent(test: TestInfo,id:string) {
    const batch = this.mFirestore.firestore.batch();
    const students = test.students;

    for (const student of students) {
      const studentDocRef = this.mFirestore.collection('studentResults').doc(student.rollNo).ref;

      const result =  {
        'testName': test.testName,
        'date': test.date,
        'totalMarks':student.totalMarks,
        "result": student.correct
      };
      batch.set(studentDocRef, {   [`results.${id}`]: result },{merge:true});
    }

    return batch.commit()
        .then(() => {
          console.log('Test marks added successfully');
        })
        .catch(error => {
          console.error('Error adding test marks:', error);
        });
  }
  updateTestMarksByStudent(test: TestInfo,id:string) {
    const batch = this.mFirestore.firestore.batch();
    const students = test.students;

    for (const student of students) {
      const studentDocRef = this.mFirestore.collection('studentResults').doc(student.rollNo).ref;
      const result =  {
          'testName': test.testName,
          'date': test.date,
          "result": student.correct
        };
      batch.update(studentDocRef, {   [`results.${id}`]: result });
    }

    return batch.commit()
        .then(() => {
          console.log('Test marks added successfully');
        })
        .catch(error => {
          console.error('Error adding test marks:', error);
        });
  }

  updateTest(test: TestInfo, id: any): Promise<void> {
    // alert(id)
    // Update the test document in Firestore
    return this.mFirestore.collection('tests').doc(id).update(test);
  }
}
