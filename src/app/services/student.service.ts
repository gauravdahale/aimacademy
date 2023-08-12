import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {Database, get, increment, objectVal, ref, set, update} from "@angular/fire/database";
import {collection, collectionData, deleteDoc, doc, Firestore, query, where} from "@angular/fire/firestore";
import {Observable} from "rxjs";
import {Student} from "../interfaces/Student";

@Injectable({
    providedIn: 'root'
})
export class StudentService {

    constructor(private readonly mFirestore: Firestore,
                private readonly mDatabase: Database) {


    }

    fetchLatestStudentCounter() {
        let counterRef = ref(this.mDatabase, 'counters/student')
        return get(counterRef)
    }

    updateCounter() {
        let counterRef = ref(this.mDatabase, 'counters/student')
        set(counterRef, increment(1)).then(()=>{
            console.log('Student counter updated')
        }).catch(res=>{
            console.log(res)
        })
    }

    fetchStudents() {
        let studentRef=  collection(this.mFirestore,'students')
        return collectionData(studentRef,{idField:'id'}) as Observable<Student[]>
    }
    fetchStudentsFromBatch(batchName:string) {
        let studentRef=  collection(this.mFirestore,'students')
        // Create a query against the collection.
        const q = query(studentRef, where("batchName", "==", batchName));
        return collectionData(q,{idField:'id'}) as Observable<Student[]>
    }
    deleteStudent(id:string) {
        let studentRef = doc(this.mFirestore,'students/'+id)
       return  deleteDoc(studentRef)
    }
}
