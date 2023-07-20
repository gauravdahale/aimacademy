import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {Database, get, increment, objectVal, ref, set, update} from "@angular/fire/database";
import {collection, collectionData, Firestore} from "@angular/fire/firestore";

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
        return collectionData(studentRef,{idField:'id'})
    }
}
